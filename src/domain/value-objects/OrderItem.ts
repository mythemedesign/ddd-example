import { InvalidArgumentError } from '../../shared/errors/DomainError';
import { UUIDGenerator } from '../../shared/utils/UUIDGenerator';

export class OrderItem {
  private readonly id: string;
  private readonly productId: string;
  private readonly quantity: number;
  private readonly unitPrice: number;
  private readonly subtotal: number;

  constructor(productId: string, quantity: number, unitPrice: number) {
    this.validateProductId(productId);
    this.validateQuantity(quantity);
    this.validateUnitPrice(unitPrice);

    this.id = UUIDGenerator.generate();
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = this.calculateSubtotal();
  }

  private validateProductId(productId: string): void {
    if (!productId || productId.trim().length === 0) {
      throw new InvalidArgumentError('Product ID cannot be empty');
    }
  }

  private validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new InvalidArgumentError('Quantity must be greater than zero');
    }
    if (!Number.isInteger(quantity)) {
      throw new InvalidArgumentError('Quantity must be a whole number');
    }
  }

  private validateUnitPrice(unitPrice: number): void {
    if (unitPrice <= 0) {
      throw new InvalidArgumentError('Unit price must be greater than zero');
    }
  }

  private calculateSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  public getId(): string {
    return this.id;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }

  public getSubtotal(): number {
    return this.subtotal;
  }

  public equals(other: OrderItem): boolean {
    return this.productId === other.productId &&
           this.quantity === other.quantity &&
           this.unitPrice === other.unitPrice;
  }
}