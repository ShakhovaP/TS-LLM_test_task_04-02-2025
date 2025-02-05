export default () => { 
    return {
        mongodb: {
            uri: process.env.MONGODB_URI,
        },
        kafka: {
            broker: process.env.KAFKA_BROKER,
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
            topicName: process.env.KAFKA_TOPIC_NAME,
            groupIdPrefix: process.env.KAFKA_GROUP_ID_PREFIX,
        },
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
        }
    };
};