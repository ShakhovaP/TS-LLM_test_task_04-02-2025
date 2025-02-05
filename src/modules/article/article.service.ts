import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>,
    ) {}

    async create(articleData: Partial<Article>): Promise<Article> {
        const article = new this.articleModel(articleData);
        return article.save();
    }

    async findSimilar(query: string, limit = 5): Promise<Article[]> {
        try {
        const articles = await this.articleModel
            .find(
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } } 
            )
            .sort({ score: { $meta: 'textScore' } }) // Sort by text relevance
            .limit(limit)
            .exec();

        if (articles.length === 0) {
            // If no exact matches, try more flexible search
            return await this.articleModel
            .find({
                $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
                ]
            })
            .limit(limit)
            .sort({ date: -1 })
            .exec();
        }

        return articles;
        } catch (error) {
            console.error('Error in findSimilar:', error);
        throw error;
        }
    }
}