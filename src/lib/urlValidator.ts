/**
 * URL Validator for Scraping API
 * Protects against SSRF attacks by validating URLs before fetching
 */

// Blocked hostnames (case-insensitive)
const BLOCKED_HOSTNAMES = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
];

// Blocked domain suffixes
const BLOCKED_DOMAIN_SUFFIXES = [
    '.local',
    '.localhost',
    '.internal',
];

/**
 * Check if an IP address is in a private/internal range
 */
function isPrivateIP(ip: string): boolean {
    // IPv4 patterns
    const privateRanges = [
        /^127\./,                    // Loopback (127.0.0.0/8)
        /^10\./,                     // Private Class A (10.0.0.0/8)
        /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private Class B (172.16.0.0/12)
        /^192\.168\./,               // Private Class C (192.168.0.0/16)
        /^169\.254\./,               // Link-local (169.254.0.0/16)
        /^0\./,                      // Current network (0.0.0.0/8)
        /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Shared address space (100.64.0.0/10)
    ];

    return privateRanges.some(pattern => pattern.test(ip));
}

/**
 * Check if hostname looks like an IP address
 */
function isIPAddress(hostname: string): boolean {
    // Simple IPv4 check
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    // Simple IPv6 check (including bracketed)
    const ipv6Pattern = /^(\[)?[0-9a-fA-F:]+(\])?$/;

    return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname);
}

export interface UrlValidationResult {
    valid: boolean;
    error?: string;
    url?: URL;
}

/**
 * Validate a URL for safe scraping
 * Returns validation result with parsed URL if valid
 */
export function validateUrlForScraping(urlString: string): UrlValidationResult {
    // Check if URL string is provided
    if (!urlString || typeof urlString !== 'string') {
        return { valid: false, error: 'URL is required' };
    }

    // Trim whitespace
    urlString = urlString.trim();

    // Parse URL
    let url: URL;
    try {
        url = new URL(urlString);
    } catch {
        return { valid: false, error: 'Invalid URL format' };
    }

    // Check protocol (only http and https allowed)
    if (!['http:', 'https:'].includes(url.protocol)) {
        return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    const hostname = url.hostname.toLowerCase();

    // Check against blocked hostnames
    if (BLOCKED_HOSTNAMES.includes(hostname)) {
        return { valid: false, error: 'Access to local/internal hosts is not allowed' };
    }

    // Check against blocked domain suffixes
    for (const suffix of BLOCKED_DOMAIN_SUFFIXES) {
        if (hostname.endsWith(suffix)) {
            return { valid: false, error: 'Access to local/internal domains is not allowed' };
        }
    }

    // If hostname is an IP address, check if it's private
    if (isIPAddress(hostname)) {
        // Remove brackets from IPv6
        const cleanIP = hostname.replace(/^\[|\]$/g, '');
        if (isPrivateIP(cleanIP)) {
            return { valid: false, error: 'Access to private/internal IP addresses is not allowed' };
        }
    }

    // All checks passed
    return { valid: true, url };
}
