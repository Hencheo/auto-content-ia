/**
 * In-Memory Rate Limiter for Scraping API
 * Limits requests per IP to prevent DoS attacks
 * 
 * NOTE: This is in-memory rate limiting which works best for single-server deployments.
 * For serverless (Vercel), consider migrating to Upstash Redis for production.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// Configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 10;      // 10 requests per window

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval - remove expired entries every 5 minutes
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
    if (cleanupInterval) return;

    cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetTime < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000); // Every 5 minutes
}

// Start cleanup on module load
startCleanup();

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // seconds until reset
}

/**
 * Check if a request from the given IP is allowed
 * @param ip - The client IP address
 * @returns RateLimitResult with allowed status and metadata
 */
export function checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const key = `rate:${ip}`;

    let entry = rateLimitStore.get(key);

    // If no entry exists or the window has expired, create a new one
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS,
        };
        rateLimitStore.set(key, entry);

        return {
            allowed: true,
            remaining: RATE_LIMIT_MAX_REQUESTS - 1,
            resetIn: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
        };
    }

    // Entry exists and is still valid
    entry.count++;

    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);

    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetIn,
        };
    }

    return {
        allowed: true,
        remaining,
        resetIn,
    };
}

/**
 * Get rate limit headers for response
 * @param result - The rate limit check result
 * @returns Headers object with rate limit info
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetIn),
    };
}
