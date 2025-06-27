import { BaseEntity } from '../../shared/base/BaseEntity';
import { OrderItem } from '../value-objects/OrderItem';
import { InvalidArgumentError } from '../../shared/errors/DomainError';

export class Order extends BaseEntity {
  private customerId: string;
  private items: OrderItem[];
  private status: OrderStatus;
  private totalAmount: number;

  constructor(customerId: string) {
    super();
    this.validateCustomerId(customerId);
    this.customerId = customerId;
    this.items = [];
    this.status = OrderStatus.PENDING;
    this.totalAmount = 0;
  }

  public addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidArgumentError('Cannot modify a non-pending order');
    }
    this.items.push(item);
    this.calculateTotalAmount();
    this.setUpdatedAt();
  }

  public removeItem(itemId: string): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidArgumentError('Cannot modify a non-pending order');
    }
    this.items = this.items.filter(item => item.getId() !== itemId);
    this.calculateTotalAmount();
    this.setUpdatedAt();
  }

  public confirm(): void {
    if (this.items.length === 0) {
      throw new InvalidArgumentError('Cannot confirm an empty order');
    }
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidArgumentError('Order is not in pending status');
    }
    this.status = OrderStatus.CONFIRMED;
    this.setUpdatedAt();
  }

  public cancel(): void {
    if (this.status === OrderStatus.DELIVERED || this.status === OrderStatus.CANCELLED) {
      throw new InvalidArgumentError('Cannot cancel a delivered or already cancelled order');
    }
    this.status = OrderStatus.CANCELLED;
    this.setUpdatedAt();
  }

  public deliver(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new InvalidArgumentError('Can only deliver confirmed orders');
    }
    this.status = OrderStatus.DELIVERED;
    this.setUpdatedAt();
  }

  private calculateTotalAmount(): void {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  private validateCustomerId(customerId: string): void {
    if (!customerId || customerId.trim().length === 0) {
      throw new InvalidArgumentError('Customer ID cannot be empty');
    }
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getItems(): OrderItem[] {
    return [...this.items];
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}