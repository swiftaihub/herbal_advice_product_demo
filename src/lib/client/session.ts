const sessionStorageKey = "herbal-atelier-session-id";

function createSessionId() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));

  return Array.from(bytes)
    .map((chunk) => chunk.toString(16).padStart(2, "0"))
    .join("");
}

export function getClientSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.localStorage.getItem(sessionStorageKey);

  if (existing) {
    return existing;
  }

  const created = createSessionId();
  window.localStorage.setItem(sessionStorageKey, created);

  return created;
}
