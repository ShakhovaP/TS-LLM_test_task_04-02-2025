import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { ArticleModule } from './modules/article/article.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { LLMModule } from './modules/llm/llm.module';
import { AgentModule } from './modules/agent/agent.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>('mongodb.uri');
                if (!uri) {
                    throw new Error('MongoDB URI is not configured');
                }
                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
            },
            inject: [ConfigService],
        }),
        ArticleModule,
        KafkaModule,
        LLMModule,
        AgentModule,
    ],
})
export class AppModule {}