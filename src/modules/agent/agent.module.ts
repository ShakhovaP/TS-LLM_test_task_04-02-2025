import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { ArticleModule } from '../article/article.module';
import { LLMModule } from '../llm/llm.module';
import { ContentExtractorService } from '../article/content-extractor.service';

@Module({
    imports: [ArticleModule, LLMModule],
    controllers: [AgentController],
    providers: [AgentService, ContentExtractorService],
})
export class AgentModule {}