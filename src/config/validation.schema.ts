import * as Joi from 'joi';

export const validationSchema = Joi.object({
    KAFKA_BROKER: Joi.string().required(),
    KAFKA_USERNAME: Joi.string().required(),
    KAFKA_PASSWORD: Joi.string().required(),
    KAFKA_TOPIC_NAME: Joi.string().required(),
    KAFKA_GROUP_ID_PREFIX: Joi.string().required(),
    MONGODB_URI: Joi.string().required(),
    GEMINI_API_KEY: Joi.string().required(),
});