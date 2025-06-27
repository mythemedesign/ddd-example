import { Order } from '../entities/Order';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  delete(orderId: string): Promise<void>;
  exists(orderId: string): Promise<boolean>;
}