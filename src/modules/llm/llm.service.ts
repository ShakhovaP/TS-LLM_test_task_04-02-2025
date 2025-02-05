import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class LLMService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        this.genAI = new GoogleGenerativeAI(
            this.configService.get<string>('gemini.apiKey'),
        );
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async cleanContent(content: string): Promise<any> {
        const prompt = `
            Return a JSON object:
            {
                "title": "Article title",
                "content": "Cleaned article content",
                "summary": "Brief summary of the article"
            } from ${content}
        `;

        const result = await this.model.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    async generateResponse(query: string, context: string): Promise<string> {
        const prompt = `
            Ansver the question: ${query} based on:
            ${context}
        `;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}