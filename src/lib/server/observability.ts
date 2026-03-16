type JsonValue = boolean | number | string | null | undefined;

type LogDetails = Record<string, JsonValue>;

interface EndpointCounterState {
  total: number;
  blocked: number;
  statuses: Record<string, number>;
}

declare global {
  var __endpointCounterStore: Map<string, EndpointCounterState> | undefined;
}

function getCounterStore() {
  if (!globalThis.__endpointCounterStore) {
    globalThis.__endpointCounterStore = new Map<string, EndpointCounterState>();
  }

  return globalThis.__endpointCounterStore;
}

function sumStatusFamily(
  statuses: Record<string, number>,
  matcher: (statusCode: number) => boolean,
) {
  return Object.entries(statuses).reduce((total, [statusCode, count]) => {
    const numericCode = Number(statusCode);

    return matcher(numericCode) ? total + count : total;
  }, 0);
}

export function logServerEvent(
  level: "error" | "info" | "warn",
  event: string,
  details: LogDetails = {},
) {
  const logger =
    level === "error" ? console.error : level === "warn" ? console.warn : console.info;

  logger(
    JSON.stringify({
      ts: new Date().toISOString(),
      source: "herbal-atelier-platform",
      event,
      ...details,
    }),
  );
}

export function recordEndpointObservation(
  endpoint: string,
  status: number,
  blockedReason?: string,
) {
  const store = getCounterStore();
  const current = store.get(endpoint) ?? {
    total: 0,
    blocked: 0,
    statuses: {},
  };

  current.total += 1;
  current.statuses[String(status)] = (current.statuses[String(status)] ?? 0) + 1;

  if (blockedReason) {
    current.blocked += 1;
  }

  store.set(endpoint, current);

  if (current.total === 1 || current.total % 25 === 0) {
    logServerEvent("info", "endpoint_summary", {
      endpoint,
      total: current.total,
      blocked: current.blocked,
      status2xx: sumStatusFamily(current.statuses, (statusCode) => statusCode >= 200 && statusCode < 300),
      status4xx: sumStatusFamily(current.statuses, (statusCode) => statusCode >= 400 && statusCode < 500),
      status5xx: sumStatusFamily(current.statuses, (statusCode) => statusCode >= 500 && statusCode < 600),
    });
  }
}
