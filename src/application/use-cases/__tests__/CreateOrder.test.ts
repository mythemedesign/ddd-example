import { CreateOrder } from '../CreateOrder';
import { OrderDomainService } from '../../../domain/services/OrderDomainService';
import { OrderCreated } from '../../../domain/events/OrderCreated';
import { InvalidArgumentError } from '../../../shared/errors/DomainError';

describe('CreateOrder Use Case', () => {
  let mockOrderDomainService: jest.Mocked<OrderDomainService>;
  let createOrderUseCase: CreateOrder;
  const validCustomerId = 'customer-123';

  beforeEach(() => {
    mockOrderDomainService = {
      createOrder: jest.fn(),
      confirmOrder: jest.fn(),
      cancelOrder: jest.fn(),
      deliverOrder: jest.fn(),
      getOrderById: jest.fn(),
      getOrdersByCustomerId: jest.fn()
    };
    createOrderUseCase = new CreateOrder(mockOrderDomainService);
  });

  describe('execute', () => {
    it('should create a new order with valid DTO', async () => {
      orderDomainService.createOrder.mockResolvedValue(mockOrder);

      const result = await createOrderUseCase.execute(validOrderDTO);

      expect(result).toEqual({
        orderId: mockOrder.id,
        customerId: mockOrder.customerId,
        items: mockOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        })),
        status: mockOrder.status,
        totalAmount: mockOrder.totalAmount,
        createdAt: mockOrder.createdAt,
        updatedAt: mockOrder.updatedAt
      });

      expect(orderDomainService.createOrder).toHaveBeenCalledWith(
        validOrderDTO.customerId,
        validOrderDTO.items
      );
    });

    it('should throw error when DTO is missing customer ID', async () => {
      const invalidDTO = {
        ...validOrderDTO,
        customerId: ''
      };

      await expect(createOrderUseCase.execute(invalidDTO))
        .rejects.toThrow(InvalidArgumentError);

      expect(orderDomainService.createOrder).not.toHaveBeenCalled();
    });

    it('should throw error when DTO has no items', async () => {
      const invalidDTO = {
        ...validOrderDTO,
        items: []
      };

      await expect(createOrderUseCase.execute(invalidDTO))
        .rejects.toThrow(InvalidArgumentError);

      expect(orderDomainService.createOrder).not.toHaveBeenCalled();
    });

    it('should throw error when item has invalid quantity', async () => {
      const invalidDTO = {
        ...validOrderDTO,
        items: [{
          ...validOrderDTO.items[0],
          quantity: 0
        }]
      };

      await expect(createOrderUseCase.execute(invalidDTO))
        .rejects.toThrow(InvalidArgumentError);

      expect(orderDomainService.createOrder).not.toHaveBeenCalled();
    });

    it('should throw error when item has invalid unit price', async () => {
      const invalidDTO = {
        ...validOrderDTO,
        items: [{
          ...validOrderDTO.items[0],
          unitPrice: -1
        }]
      };

      await expect(createOrderUseCase.execute(invalidDTO))
        .rejects.toThrow(InvalidArgumentError);

      expect(orderDomainService.createOrder).not.toHaveBeenCalled();
    });
  });
});