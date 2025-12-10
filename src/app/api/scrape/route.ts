import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { validateUrlForScraping } from '@/lib/urlValidator';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rateLimiter';

// Timeout for fetch requests (10 seconds)
const FETCH_TIMEOUT_MS = 10000;

// Maximum content size to process (1MB)
const MAX_CONTENT_SIZE = 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? req.headers.get('x-real-ip')
            ?? 'unknown';

        // Check rate limit
        const rateLimit = checkRateLimit(ip);
        const rateLimitHeaders = getRateLimitHeaders(rateLimit);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        ...rateLimitHeaders,
                        'Retry-After': String(rateLimit.resetIn),
                    }
                }
            );
        }

        const { url } = await req.json();

        // Validate URL (SSRF protection)
        const urlValidation = validateUrlForScraping(url);
        if (!urlValidation.valid) {
            return NextResponse.json(
                { error: urlValidation.error },
                { status: 400, headers: rateLimitHeaders }
            );
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(urlValidation.url!.toString(), {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                return NextResponse.json(
                    { error: 'Failed to fetch URL' },
                    { status: response.status, headers: rateLimitHeaders }
                );
            }

            // Check content length before reading
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) > MAX_CONTENT_SIZE) {
                return NextResponse.json(
                    { error: 'Content too large to process' },
                    { status: 413, headers: rateLimitHeaders }
                );
            }

            const html = await response.text();

            // Double-check size after reading (in case content-length was missing)
            if (html.length > MAX_CONTENT_SIZE) {
                return NextResponse.json(
                    { error: 'Content too large to process' },
                    { status: 413, headers: rateLimitHeaders }
                );
            }

            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            $('header').remove();
            $('aside').remove();
            $('.ad').remove();
            $('.advertisement').remove();

            // Extract title
            const title = $('h1').first().text().trim() || $('title').text().trim();

            // Extract main content
            // Try to find common article containers or fallback to body paragraphs
            let content = '';
            const articleSelectors = ['article', '.post-content', '.entry-content', '.article-body', 'main'];

            let foundContent = false;
            for (const selector of articleSelectors) {
                if ($(selector).length > 0) {
                    content = $(selector).find('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
                    if (content.length > 100) {
                        foundContent = true;
                        break;
                    }
                }
            }

            if (!foundContent) {
                content = $('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
            }

            // Limit content length to avoid token limits (approx 10k chars)
            content = content.slice(0, 10000);

            return NextResponse.json(
                { title, content },
                { headers: rateLimitHeaders }
            );

        } catch (fetchError) {
            clearTimeout(timeoutId);

            // Check if it was a timeout
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'Request timed out. The target URL took too long to respond.' },
                    { status: 504, headers: rateLimitHeaders }
                );
            }

            throw fetchError;
        }

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
