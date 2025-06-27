import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { OrderCreated } from '../../domain/events/OrderCreated';

export class KafkaProducer {
  private producer: Producer;
  private readonly topic: string;

  constructor(kafka: Kafka, topic: string) {
    this.producer = kafka.producer();
    this.topic = topic;
  }

  public async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
    } catch (error) {
      console.error('Failed to disconnect from Kafka:', error);
      throw error;
    }
  }

  public async publishOrderCreated(event: OrderCreated): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify(event.toJSON()),
          headers: {
            eventType: event.eventType,
            timestamp: Date.now().toString()
          }
        }
      ]
    };

    try {
      await this.producer.send(record);
    } catch (error) {
      console.error('Failed to publish OrderCreated event:', error);
      throw error;
    }
  }

  public async publishMessage(key: string, value: any, headers?: Record<string, string>): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          headers: headers || {}
        }
      ]
    };

    try {
      await this.producer.send(record);
    } catch (error) {
      console.error('Failed to publish message:', error);
      throw error;
    }
  }
}