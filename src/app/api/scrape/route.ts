import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: response.status });
        }

        const html = await response.text();
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

        return NextResponse.json({ title, content });

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
