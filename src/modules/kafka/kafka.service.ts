import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;
    private messageProcessor: (data: any) => Promise<void>;
    private isInitialized: boolean = false;

    constructor(private configService: ConfigService) {
        console.log('Creating Kafka instance...');
        this.kafka = new Kafka({
        brokers: [this.configService.get<string>('kafka.broker')],
        sasl: {
            mechanism: 'plain',
            username: this.configService.get<string>('kafka.username'),
            password: this.configService.get<string>('kafka.password'),
        },
        ssl: true,
        });

        // Create the consumer with a unique group ID
        this.consumer = this.kafka.consumer({
            groupId: `${this.configService.get<string>('kafka.groupIdPrefix')}${Date.now()}`,
        });
    }

  // set up message handling before initialization
    async setMessageHandler(handler: (data: any) => Promise<void>) {
        console.log('Setting up message handler...');
        this.messageProcessor = handler;
        
        // If we're already initialized, we need to start processing
        if (this.isInitialized) {
            await this.startProcessing();
        }
    }

    private async startProcessing() {
        // Set up the message processing pipeline
        await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const messageValue = message.value?.toString();
                if (messageValue && this.messageProcessor) {
                    const data = JSON.parse(messageValue);
                    await this.messageProcessor(data);
                    console.log('Message processed successfully');
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
        });
        console.log('Message processing started');
    }

    async onModuleInit() {
        try {
            console.log('Initializing Kafka service...');
            
            // Connect to Kafka
            await this.consumer.connect();
            console.log('Consumer connected successfully');

            // Subscribe to the specified topic
            const topic = this.configService.get<string>('kafka.topicName');
            await this.consumer.subscribe({ 
                topic,
                fromBeginning: true 
            });
            console.log(`Subscribed to topic: ${topic}`);

            // If we already have a message handler, start processing
            if (this.messageProcessor) {
                await this.startProcessing();
            }

            this.isInitialized = true;
            console.log('Kafka service initialization complete');
        } catch (error) {
            console.error('Failed to initialize Kafka service:', error);
        throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.consumer.disconnect();
            console.log('Kafka consumer disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting Kafka consumer:', error);
        }
    }
}