import { OrderItem } from '../value-objects/OrderItem';

interface OrderCreatedProps {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

export class OrderCreated {
  public readonly orderId: string;
  public readonly customerId: string;
  public readonly items: OrderItem[];
  public readonly totalAmount: number;
  public readonly createdAt: Date;
  public readonly eventType: string = 'OrderCreated';

  constructor(props: OrderCreatedProps) {
    this.orderId = props.orderId;
    this.customerId = props.customerId;
    this.items = props.items;
    this.totalAmount = props.totalAmount;
    this.createdAt = props.createdAt;
  }

  public toJSON(): Record<string, any> {
    return {
      eventType: this.eventType,
      orderId: this.orderId,
      customerId: this.customerId,
      items: this.items.map(item => ({
        productId: item.getProductId(),
        quantity: item.getQuantity(),
        unitPrice: item.getUnitPrice(),
        subtotal: item.getSubtotal()
      })),
      totalAmount: this.totalAmount,
      createdAt: this.createdAt.toISOString()
    };
  }
}