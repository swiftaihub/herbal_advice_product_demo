export interface RateLimitPolicy {
  burstLimit: number;
  burstWindowMs: number;
  cooldownMs: number;
  windowLimit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  degraded?: boolean;
  reason?: "burst" | "cooldown" | "window";
  remaining: number;
  retryAfterMs: number;
}

interface RateLimitState {
  burstHits: number[];
  cooldownUntil: number;
  lastSeen: number;
  windowHits: number[];
}

declare global {
  var __rateLimitStore: Map<string, RateLimitState> | undefined;
}

const maxTrackedKeys = 5000;

export const anonymousContactPolicy: RateLimitPolicy = {
  burstLimit: 2,
  burstWindowMs: 60_000,
  windowLimit: 6,
  windowMs: 15 * 60_000,
  cooldownMs: 30 * 60_000,
};

function getRateLimitStore() {
  if (!globalThis.__rateLimitStore) {
    globalThis.__rateLimitStore = new Map<string, RateLimitState>();
  }

  return globalThis.__rateLimitStore;
}

function pruneHits(hits: number[], cutoff: number) {
  return hits.filter((timestamp) => timestamp >= cutoff);
}

function pruneStore(store: Map<string, RateLimitState>, now: number, ttlMs: number) {
  if (store.size <= maxTrackedKeys) {
    return;
  }

  for (const [key, state] of store) {
    if (state.lastSeen < now - ttlMs) {
      store.delete(key);
    }
  }
}

export function applyRateLimit(
  key: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): RateLimitResult {
  try {
    const store = getRateLimitStore();
    const state = store.get(key) ?? {
      burstHits: [],
      windowHits: [],
      cooldownUntil: 0,
      lastSeen: now,
    };

    if (state.cooldownUntil > now) {
      return {
        allowed: false,
        reason: "cooldown",
        remaining: 0,
        retryAfterMs: state.cooldownUntil - now,
      };
    }

    state.burstHits = pruneHits(state.burstHits, now - policy.burstWindowMs);
    state.windowHits = pruneHits(state.windowHits, now - policy.windowMs);
    state.lastSeen = now;

    if (state.burstHits.length >= policy.burstLimit) {
      state.cooldownUntil = now + policy.cooldownMs;
      store.set(key, state);

      return {
        allowed: false,
        reason: "burst",
        remaining: 0,
        retryAfterMs: policy.cooldownMs,
      };
    }

    if (state.windowHits.length >= policy.windowLimit) {
      state.cooldownUntil = now + policy.cooldownMs;
      store.set(key, state);

      return {
        allowed: false,
        reason: "window",
        remaining: 0,
        retryAfterMs: policy.cooldownMs,
      };
    }

    state.burstHits.push(now);
    state.windowHits.push(now);
    store.set(key, state);
    pruneStore(store, now, Math.max(policy.cooldownMs, policy.windowMs) * 2);

    return {
      allowed: true,
      remaining: Math.max(policy.windowLimit - state.windowHits.length, 0),
      retryAfterMs: 0,
    };
  } catch {
    return {
      allowed: true,
      degraded: true,
      remaining: policy.windowLimit,
      retryAfterMs: 0,
    };
  }
}

export function applyRateLimits(
  keys: string[],
  policy: RateLimitPolicy,
  now = Date.now(),
): RateLimitResult {
  let remaining = policy.windowLimit;
  let degraded = false;

  for (const key of keys) {
    const result = applyRateLimit(key, policy, now);
    degraded = degraded || Boolean(result.degraded);
    remaining = Math.min(remaining, result.remaining);

    if (!result.allowed) {
      return {
        ...result,
        degraded,
      };
    }
  }

  return {
    allowed: true,
    degraded,
    remaining,
    retryAfterMs: 0,
  };
}
