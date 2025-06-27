import { Kafka } from 'kafkajs';
import { MongoClient } from 'mongodb';

export interface Config {
  mongo: {
    url: string;
    dbName: string;
  };
  kafka: {
    clientId: string;
    brokers: string[];
    orderTopic: string;
  };
  server: {
    port: number;
  };
}

export const config: Config = {
  mongo: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'orders_db'
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    orderTopic: process.env.KAFKA_ORDER_TOPIC || 'orders'
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  }
};

export const createMongoClient = async (): Promise<MongoClient> => {
  const client = new MongoClient(config.mongo.url);
  await client.connect();
  return client;
};

export const createKafkaClient = (): Kafka => {
  return new Kafka({
    clientId: config.kafka.clientId,
    brokers: config.kafka.brokers
  });
};