import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { logServerEvent } from "@/lib/server/observability";
import { applyRateLimit } from "@/lib/server/rate-limit";
import {
  buildRequestIdentity,
  createRequestId,
  getConfiguredOriginAllowList,
  isAllowedOrigin,
} from "@/lib/server/request-identity";

const contactIngressPolicy = {
  burstLimit: 4,
  burstWindowMs: 60_000,
  windowLimit: 12,
  windowMs: 15 * 60_000,
  cooldownMs: 15 * 60_000,
} as const;

export async function middleware(request: NextRequest) {
  const requestId = createRequestId(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  if (request.nextUrl.pathname !== "/api/contact") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
        "x-request-id": requestId,
      },
    });
  }

  const identity = await buildRequestIdentity(request);
  const allowedOrigins = getConfiguredOriginAllowList();
  const hasAllowedOrigin = isAllowedOrigin(request, allowedOrigins);
  const baseLog = {
    endpoint: "contact",
    ipHash: identity.ipHash,
    method: request.method,
    path: request.nextUrl.pathname,
    requestId,
    sessionHash: identity.sessionHash ?? "none",
    userAgentFamily: identity.userAgentFamily,
  };

  if (!["OPTIONS", "POST"].includes(request.method)) {
    logServerEvent("warn", "api_guard_blocked", {
      ...baseLog,
      reason: "method_not_allowed",
      status: 405,
    });

    return NextResponse.json(
      { error: "Method not allowed" },
      {
        status: 405,
        headers: {
          Allow: "OPTIONS, POST",
          "Cache-Control": "no-store",
          "x-request-id": requestId,
        },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > 8_192) {
    logServerEvent("warn", "api_guard_blocked", {
      ...baseLog,
      reason: "payload_too_large",
      status: 413,
    });

    return NextResponse.json(
      { error: "Payload too large" },
      {
        status: 413,
        headers: {
          "Cache-Control": "no-store",
          "x-request-id": requestId,
        },
      },
    );
  }

  if (!hasAllowedOrigin) {
    logServerEvent("warn", "api_guard_blocked", {
      ...baseLog,
      reason: "invalid_origin",
      status: 403,
    });

    return NextResponse.json(
      { error: "Forbidden" },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
          "x-request-id": requestId,
        },
      },
    );
  }

  if (identity.userAgentFamily === "automation") {
    logServerEvent("warn", "api_guard_blocked", {
      ...baseLog,
      reason: "automation_user_agent",
      status: 403,
    });

    return NextResponse.json(
      { error: "Forbidden" },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
          "x-request-id": requestId,
        },
      },
    );
  }

  const coarseLimit = applyRateLimit(
    `middleware:contact:ip:${identity.ipHash}`,
    contactIngressPolicy,
  );

  if (!coarseLimit.allowed) {
    const retryAfterSeconds = Math.max(Math.ceil(coarseLimit.retryAfterMs / 1000), 1);

    logServerEvent("warn", "api_guard_blocked", {
      ...baseLog,
      reason: coarseLimit.reason ?? "rate_limited",
      retryAfterSeconds,
      status: 429,
    });

    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(retryAfterSeconds),
          "x-request-id": requestId,
        },
      },
    );
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
