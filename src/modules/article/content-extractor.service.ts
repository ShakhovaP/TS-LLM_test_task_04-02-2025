import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ContentExtractorService {
    async extract(url: string): Promise<{
        title: string;
        content: string;
        url: string;
        date: Date;
    }> {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            // Remove unnecessary elements
            $('script, style, nav, footer, header, ads').remove();

            const title =
                $('h1').first().text().trim() || $('title').text().trim();
            const content = $('article, main, .content')
                .text()
                .replace(/\s+/g, ' ')
                .trim();

            return {
                title,
                content,
                url,
                date: new Date(),
            };
        } catch (error) {
            console.error(`Error extracting content from ${url}:`, error);
        throw error;
        }
    }
}