import { ArticleService } from './modules/article/article.service';
import { LLMService } from './modules/llm/llm.service';
import { ContentExtractorService } from './modules/article/content-extractor.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaService } from './modules/kafka/kafka.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    const kafkaService = app.get(KafkaService);
    const articleService = app.get(ArticleService);
    const llmService = app.get(LLMService);
    const contentExtractor = app.get(ContentExtractorService);
    
    await kafkaService.setMessageHandler(async (data) => {
        try {
            console.log('Processing received data:');

            const rawArticle = await contentExtractor.extract(data.value.url);
            const cleanedContent = await llmService.cleanContent(rawArticle.content);
            await articleService.create({
                ...cleanedContent,
                url: data.value.url,
                date: new Date(rawArticle.date),
            });
        } catch (error) {
            console.error('Error processing article:', error);
        }

    });

    await app.listen(3000);
    console.log('Application is running on port 3000');
}
bootstrap();