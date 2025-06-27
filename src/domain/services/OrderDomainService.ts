import { Order } from '../entities/Order';
import { OrderItem } from '../value-objects/OrderItem';
import { IOrderRepository } from '../repository/IOrderRepository';
import { OrderCreated } from '../events/OrderCreated';
import { InvalidArgumentError } from '../../shared/errors/DomainError';

export class OrderDomainService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  public async createOrder(customerId: string, items: OrderItem[]): Promise<OrderCreated> {
    if (!items || items.length === 0) {
      throw new InvalidArgumentError('Order must contain at least one item');
    }

    const order = new Order(customerId);
    items.forEach(item => order.addItem(item));

    await this.orderRepository.save(order);

    return new OrderCreated({
      orderId: order.getId(),
      customerId: order.getCustomerId(),
      items: order.getItems(),
      totalAmount: order.getTotalAmount(),
      createdAt: order.getCreatedAt()
    });
  }

  public async confirmOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    order.confirm();
    await this.orderRepository.save(order);
  }

  public async cancelOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    order.cancel();
    await this.orderRepository.save(order);
  }

  public async deliverOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    order.deliver();
    await this.orderRepository.save(order);
  }

  public async getOrderById(orderId: string): Promise<Order> {
    return await this.orderRepository.findById(orderId);
  }

  public async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return await this.orderRepository.findByCustomerId(customerId);
  }
}