import { OrderItem } from '../OrderItem';
import { InvalidArgumentError } from '../../../shared/errors/DomainError';

describe('OrderItem Value Object', () => {
  const validProductId = 'product-123';
  const validQuantity = 2;
  const validUnitPrice = 10;

  describe('Creation', () => {
    it('should create a valid order item', () => {
      const item = new OrderItem(validProductId, validQuantity, validUnitPrice);
      
      expect(item.getProductId()).toBe(validProductId);
      expect(item.getQuantity()).toBe(validQuantity);
      expect(item.getUnitPrice()).toBe(validUnitPrice);
      expect(item.getSubtotal()).toBe(validQuantity * validUnitPrice);
      expect(item.getId()).toBeDefined();
    });

    it('should throw error when product ID is empty', () => {
      expect(() => new OrderItem('', validQuantity, validUnitPrice))
        .toThrow(InvalidArgumentError);
    });

    it('should throw error when quantity is zero', () => {
      expect(() => new OrderItem(validProductId, 0, validUnitPrice))
        .toThrow(InvalidArgumentError);
    });

    it('should throw error when quantity is negative', () => {
      expect(() => new OrderItem(validProductId, -1, validUnitPrice))
        .toThrow(InvalidArgumentError);
    });

    it('should throw error when quantity is not a whole number', () => {
      expect(() => new OrderItem(validProductId, 1.5, validUnitPrice))
        .toThrow(InvalidArgumentError);
    });

    it('should throw error when unit price is zero', () => {
      expect(() => new OrderItem(validProductId, validQuantity, 0))
        .toThrow(InvalidArgumentError);
    });

    it('should throw error when unit price is negative', () => {
      expect(() => new OrderItem(validProductId, validQuantity, -1))
        .toThrow(InvalidArgumentError);
    });
  });

  describe('Value Object Equality', () => {
    it('should consider two items with same values as equal', () => {
      const item1 = new OrderItem(validProductId, validQuantity, validUnitPrice);
      const item2 = new OrderItem(validProductId, validQuantity, validUnitPrice);
      
      expect(item1.equals(item2)).toBe(true);
    });

    it('should consider items with different product IDs as not equal', () => {
      const item1 = new OrderItem(validProductId, validQuantity, validUnitPrice);
      const item2 = new OrderItem('different-product', validQuantity, validUnitPrice);
      
      expect(item1.equals(item2)).toBe(false);
    });

    it('should consider items with different quantities as not equal', () => {
      const item1 = new OrderItem(validProductId, validQuantity, validUnitPrice);
      const item2 = new OrderItem(validProductId, validQuantity + 1, validUnitPrice);
      
      expect(item1.equals(item2)).toBe(false);
    });

    it('should consider items with different unit prices as not equal', () => {
      const item1 = new OrderItem(validProductId, validQuantity, validUnitPrice);
      const item2 = new OrderItem(validProductId, validQuantity, validUnitPrice + 1);
      
      expect(item1.equals(item2)).toBe(false);
    });
  });

  describe('Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const quantity = 3;
      const unitPrice = 15;
      const item = new OrderItem(validProductId, quantity, unitPrice);
      
      expect(item.getSubtotal()).toBe(quantity * unitPrice);
    });
  });
});