import { Request, Response } from 'express';
import { OrderController } from '../OrderController';
import { CreateOrder } from '../../../../application/use-cases/CreateOrder';
import { OrderDomainService } from '../../../../domain/services/OrderDomainService';
import { Order, OrderStatus } from '../../../../domain/entities/Order';
import { OrderItem } from '../../../../domain/value-objects/OrderItem';
import { InvalidArgumentError, NotFoundError, DomainError } from '../../../../shared/errors/DomainError';
import { OrderCreated } from '../../../../domain/events/OrderCreated';

describe('OrderController', () => {
  let orderController: OrderController;
  let createOrderUseCase: jest.Mocked<CreateOrder>;
  let orderDomainService: jest.Mocked<OrderDomainService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockOrder: Order;

  beforeEach(() => {
    // Create mock use case and domain service
    createOrderUseCase = {
      execute: jest.fn()
    };

    orderDomainService = {
      createOrder: jest.fn(),
      confirmOrder: jest.fn(),
      cancelOrder: jest.fn(),
      deliverOrder: jest.fn(),
      getOrder: jest.fn(),
      getCustomerOrders: jest.fn()
    };

    orderController = new OrderController(createOrderUseCase, orderDomainService);

    // Create mock request and response
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Create mock order
    const orderItem = new OrderItem('product123', 2, 10.00);
    mockOrder = new Order('customer123', [orderItem]);
  });

  describe('createOrder', () => {
    beforeEach(() => {
      mockReq = {
        body: {
          customerId: 'customer123',
          items: [{
            productId: 'product123',
            quantity: 2,
            unitPrice: 10.00
          }]
        }
      };
    });

    it('should create order and return 201 status', async () => {
      const mockResponse = {
        orderId: mockOrder.id,
        customerId: mockOrder.customerId,
        items: mockOrder.items,
        status: mockOrder.status,
        totalAmount: mockOrder.totalAmount
      };

      createOrderUseCase.execute.mockResolvedValue(mockResponse);

      await orderController.createOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle validation errors', async () => {
      createOrderUseCase.execute.mockRejectedValue(new InvalidArgumentError('Invalid input'));

      await orderController.createOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid input' });
    });
  });

  describe('getOrder', () => {
    beforeEach(() => {
      mockReq = {
        params: { orderId: mockOrder.id }
      };
    });

    it('should return order and 200 status', async () => {
      orderDomainService.getOrder.mockResolvedValue(mockOrder);

      await orderController.getOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle not found error', async () => {
      orderDomainService.getOrder.mockRejectedValue(new NotFoundError('Order not found'));

      await orderController.getOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });
  });

  describe('getCustomerOrders', () => {
    beforeEach(() => {
      mockReq = {
        params: { customerId: 'customer123' }
      };
    });

    it('should return customer orders and 200 status', async () => {
      const orders = [mockOrder];
      orderDomainService.getCustomerOrders.mockResolvedValue(orders);

      await orderController.getCustomerOrders(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(orders);
    });
  });

  describe('confirmOrder', () => {
    beforeEach(() => {
      mockReq = {
        params: { orderId: mockOrder.id }
      };
    });

    it('should confirm order and return 200 status', async () => {
      await orderController.confirmOrder(mockReq as Request, mockRes as Response);

      expect(orderDomainService.confirmOrder).toHaveBeenCalledWith(mockOrder.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Order confirmed successfully' });
    });

    it('should handle not found error', async () => {
      orderDomainService.confirmOrder.mockRejectedValue(new NotFoundError('Order not found'));

      await orderController.confirmOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });
  });

  describe('cancelOrder', () => {
    beforeEach(() => {
      mockReq = {
        params: { orderId: mockOrder.id }
      };
    });

    it('should cancel order and return 200 status', async () => {
      await orderController.cancelOrder(mockReq as Request, mockRes as Response);

      expect(orderDomainService.cancelOrder).toHaveBeenCalledWith(mockOrder.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Order cancelled successfully' });
    });

    it('should handle not found error', async () => {
      orderDomainService.cancelOrder.mockRejectedValue(new NotFoundError('Order not found'));

      await orderController.cancelOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });
  });

  describe('deliverOrder', () => {
    beforeEach(() => {
      mockReq = {
        params: { orderId: mockOrder.id }
      };
    });

    it('should deliver order and return 200 status', async () => {
      await orderController.deliverOrder(mockReq as Request, mockRes as Response);

      expect(orderDomainService.deliverOrder).toHaveBeenCalledWith(mockOrder.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Order delivered successfully' });
    });

    it('should handle not found error', async () => {
      orderDomainService.deliverOrder.mockRejectedValue(new NotFoundError('Order not found'));

      await orderController.deliverOrder(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });
  });
});