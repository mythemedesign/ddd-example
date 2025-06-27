import { Router, Request, Response } from 'express';
import { OrderController } from '../controllers/OrderController';

export const createOrderRoutes = (orderController: OrderController): Router => {
  const router = Router();

  // Create a new order
  router.post('/', (req: Request, res: Response) => orderController.createOrder(req, res));

  // Get order by ID
  router.get('/:orderId', (req: Request, res: Response) => orderController.getOrder(req, res));

  // Get orders by customer ID
  router.get('/customer/:customerId', (req: Request, res: Response) => orderController.getCustomerOrders(req, res));

  // Confirm an order
  router.post('/:orderId/confirm', (req: Request, res: Response) => orderController.confirmOrder(req, res));

  // Cancel an order
  router.post('/:orderId/cancel', (req: Request, res: Response) => orderController.cancelOrder(req, res));

  // Mark an order as delivered
  router.post('/:orderId/deliver', (req: Request, res: Response) => orderController.deliverOrder(req, res));

  return router;
};