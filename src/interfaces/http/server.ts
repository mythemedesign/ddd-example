import express, { Request, Response, NextFunction } from 'express';
import { config, createKafkaClient, createMongoClient } from '../../infrastructure/config';
import { MongoOrderRepository } from '../../infrastructure/database/MongoOrderRepository';
import { KafkaProducer } from '../../infrastructure/messaging/KafkaProducer';
import { OrderDomainService } from '../../domain/services/OrderDomainService';
import { CreateOrder } from '../../application/use-cases/CreateOrder';
import { OrderController } from './controllers/OrderController';
import { createOrderRoutes } from './routes/orderRoutes';

async function startServer(): Promise<void> {
  try {
    // Initialize infrastructure dependencies
    const mongoClient = await createMongoClient();
    const kafkaClient = createKafkaClient();

    // Initialize repositories and services
    const orderRepository = new MongoOrderRepository(mongoClient);
    const kafkaProducer = new KafkaProducer(kafkaClient, config.kafka.orderTopic);
    await kafkaProducer.connect();

    // Initialize domain services
    const orderDomainService = new OrderDomainService(orderRepository);

    // Initialize use cases
    const createOrderUseCase = new CreateOrder(orderDomainService);

    // Initialize controllers
    const orderController = new OrderController(createOrderUseCase, orderDomainService);

    // Create Express app
    const app = express();

    // Middleware
    app.use(express.json());

    // Routes
    app.use('/api/orders', createOrderRoutes(orderController));

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // Start server
    app.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      await mongoClient.close();
      await kafkaProducer.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();