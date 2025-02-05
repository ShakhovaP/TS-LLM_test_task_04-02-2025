import { Injectable } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { LLMService } from '../llm/llm.service';
import { ContentExtractorService } from '../article/content-extractor.service';

@Injectable()
export class AgentService {
    constructor(
        private readonly articleService: ArticleService,
        private readonly llmService: LLMService,
        private readonly contentExtractor: ContentExtractorService,
    ) {}

    async processQuery(query: string) {
        const urlMatch = query.match(/https?:\/\/[^\s]+/);
        let context: string;
        let sources: Array<{ title: string; url: string; date: Date }>;

        if (urlMatch) {
            const article = await this.contentExtractor.extract(urlMatch[0]);
            const cleanedArticle = await this.llmService.cleanContent(
                article.content,
            );
            context = cleanedArticle.content;
            sources = [
                {
                title: cleanedArticle.title,
                url: urlMatch[0],
                date: article.date,
                },
            ];
        } else {
            const relevantArticles = await this.articleService.findSimilar(query);
            context = relevantArticles
                .map((article) => article.content)
                .join('\n\n');
            sources = relevantArticles.map((article) => ({
                title: article.title,
                url: article.url,
                date: article.date,
            }));
        }

    const answer = await this.llmService.generateResponse(query, context);
    return { answer, sources };
    }
}