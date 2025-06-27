import { OrderDomainService } from '../OrderDomainService';
import { Order } from '../../entities/Order';
import { OrderItem } from '../../value-objects/OrderItem';
import { IOrderRepository } from '../../repository/IOrderRepository';
import { NotFoundError, InvalidArgumentError } from '../../../shared/errors/DomainError';

describe('OrderDomainService', () => {
  let orderRepository: jest.Mocked<IOrderRepository>;
  let orderDomainService: OrderDomainService;
  let mockOrder: Order;

  const customerId = 'customer123';
  const orderItem = new OrderItem('product123', 2, 10.00);

  beforeEach(() => {
    // Create mock repository
    orderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    orderDomainService = new OrderDomainService(orderRepository);
    mockOrder = new Order(customerId, [orderItem]);
  });

  describe('createOrder', () => {
    it('should create and save a new order', async () => {
      const items = [{ productId: 'product123', quantity: 2, unitPrice: 10.00 }];
      
      const result = await orderDomainService.createOrder(customerId, items);

      expect(result).toBeDefined();
      expect(result.customerId).toBe(customerId);
      expect(result.items).toHaveLength(1);
      expect(orderRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('confirmOrder', () => {
    it('should confirm an existing order', async () => {
      orderRepository.findById.mockResolvedValue(mockOrder);

      await orderDomainService.confirmOrder(mockOrder.id);

      expect(mockOrder.status).toBe('confirmed');
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundError when order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderDomainService.confirmOrder('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an existing order', async () => {
      orderRepository.findById.mockResolvedValue(mockOrder);

      await orderDomainService.cancelOrder(mockOrder.id);

      expect(mockOrder.status).toBe('cancelled');
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundError when order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderDomainService.cancelOrder('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deliverOrder', () => {
    beforeEach(() => {
      mockOrder.confirm(); // Order must be confirmed before delivery
    });

    it('should deliver an existing confirmed order', async () => {
      orderRepository.findById.mockResolvedValue(mockOrder);

      await orderDomainService.deliverOrder(mockOrder.id);

      expect(mockOrder.status).toBe('delivered');
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundError when order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderDomainService.deliverOrder('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getOrder', () => {
    it('should return order by ID', async () => {
      orderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderDomainService.getOrder(mockOrder.id);

      expect(result).toBe(mockOrder);
      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrder.id);
    });

    it('should throw NotFoundError when order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderDomainService.getOrder('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getCustomerOrders', () => {
    it('should return orders by customer ID', async () => {
      const orders = [mockOrder];
      orderRepository.findByCustomerId.mockResolvedValue(orders);

      const result = await orderDomainService.getCustomerOrders(customerId);

      expect(result).toBe(orders);
      expect(orderRepository.findByCustomerId).toHaveBeenCalledWith(customerId);
    });
  });
});