import { OrderDomainService } from '../../domain/services/OrderDomainService';
import { OrderItem } from '../../domain/value-objects/OrderItem';
import { CreateOrderDTO } from '../dtos/CreateOrderDTO';
import { OrderCreated } from '../../domain/events/OrderCreated';
import { InvalidArgumentError } from '../../shared/errors/DomainError';

export class CreateOrder {
  private orderDomainService: OrderDomainService;

  constructor(orderDomainService: OrderDomainService) {
    this.orderDomainService = orderDomainService;
  }

  public async execute(createOrderDTO: CreateOrderDTO): Promise<OrderCreated> {
    this.validateCreateOrderDTO(createOrderDTO);

    const orderItems = createOrderDTO.items.map(item => 
      new OrderItem(item.productId, item.quantity, item.unitPrice)
    );

    return await this.orderDomainService.createOrder(
      createOrderDTO.customerId,
      orderItems
    );
  }

  private validateCreateOrderDTO(dto: CreateOrderDTO): void {
    if (!dto.customerId) {
      throw new InvalidArgumentError('Customer ID is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new InvalidArgumentError('Order must contain at least one item');
    }

    dto.items.forEach(item => {
      if (!item.productId) {
        throw new InvalidArgumentError('Product ID is required for each item');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new InvalidArgumentError('Quantity must be greater than zero for each item');
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new InvalidArgumentError('Unit price must be greater than zero for each item');
      }
    });
  }
}