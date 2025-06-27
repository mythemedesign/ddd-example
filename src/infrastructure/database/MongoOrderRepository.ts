import { Collection, MongoClient } from 'mongodb';
import { Order, OrderStatus } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/value-objects/OrderItem';
import { IOrderRepository } from '../../domain/repository/IOrderRepository';
import { NotFoundError } from '../../shared/errors/DomainError';

interface OrderDocument {
  _id: string;
  customerId: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoOrderRepository implements IOrderRepository {
  private collection: Collection<OrderDocument>;

  constructor(mongoClient: MongoClient) {
    this.collection = mongoClient.db('orders_db').collection<OrderDocument>('orders');
  }

  public async save(order: Order): Promise<void> {
    const orderData: OrderDocument = {
      _id: order.getId(),
      customerId: order.getCustomerId(),
      items: order.getItems().map(item => ({
        id: item.getId(),
        productId: item.getProductId(),
        quantity: item.getQuantity(),
        unitPrice: item.getUnitPrice(),
        subtotal: item.getSubtotal()
      })),
      status: order.getStatus(),
      totalAmount: order.getTotalAmount(),
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt()
    };

    await this.collection.updateOne(
      { _id: orderData._id },
      { $set: orderData },
      { upsert: true }
    );
  }

  public async findById(orderId: string): Promise<Order> {
    const orderData = await this.collection.findOne({ _id: orderId });
    if (!orderData) {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }

    return this.mapToOrder(orderData);
  }

  public async findByCustomerId(customerId: string): Promise<Order[]> {
    const ordersData = await this.collection.find({ customerId }).toArray();
    return ordersData.map(orderData => this.mapToOrder(orderData));
  }

  public async delete(orderId: string): Promise<void> {
    const result = await this.collection.deleteOne({ _id: orderId });
    if (result.deletedCount === 0) {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
  }

  public async exists(orderId: string): Promise<boolean> {
    const count = await this.collection.countDocuments({ _id: orderId });
    return count > 0;
  }

  private mapToOrder(orderData: OrderDocument): Order {
    const order = new Order(orderData.customerId);

    // Reconstruct the order with its items
    orderData.items.forEach((itemData) => {
      const orderItem = new OrderItem(
        itemData.productId,
        itemData.quantity,
        itemData.unitPrice
      );
      order.addItem(orderItem);
    });

    // Set the order status to match the stored state
    while (order.getStatus() !== orderData.status) {
      switch (orderData.status) {
        case OrderStatus.CONFIRMED:
          order.confirm();
          break;
        case OrderStatus.CANCELLED:
          order.cancel();
          break;
        case OrderStatus.DELIVERED:
          order.confirm();
          order.deliver();
          break;
        default:
          break;
      }
    }

    return order;
  }
}