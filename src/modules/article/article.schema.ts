import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    date: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);


// Create a compound text index on title and content
ArticleSchema.index(
    { 
        title: 'text', 
        content: 'text' 
    },
    {
        weights: {
            title: 10,    // Title matches are more important than content matches
            content: 5,
        },
        name: "article_search_index"
    }
);