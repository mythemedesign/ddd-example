import { Order, OrderStatus } from '../Order';
import { OrderItem } from '../../value-objects/OrderItem';
import { InvalidArgumentError } from '../../../shared/errors/DomainError';

describe('Order Entity', () => {
  const validCustomerId = 'customer-123';
  const validProductId = 'product-123';

  describe('Creation', () => {
    it('should create a valid order', () => {
      const order = new Order(validCustomerId);
      expect(order.getCustomerId()).toBe(validCustomerId);
      expect(order.getStatus()).toBe(OrderStatus.PENDING);
      expect(order.getItems()).toHaveLength(0);
      expect(order.getTotalAmount()).toBe(0);
    });

    it('should throw error when customer ID is empty', () => {
      expect(() => new Order('')).toThrow(InvalidArgumentError);
    });
  });

  describe('Item Management', () => {
    let order: Order;
    let orderItem: OrderItem;

    beforeEach(() => {
      order = new Order(validCustomerId);
      orderItem = new OrderItem(validProductId, 2, 10);
    });

    it('should add item to order', () => {
      order.addItem(orderItem);
      expect(order.getItems()).toHaveLength(1);
      expect(order.getTotalAmount()).toBe(20);
    });

    it('should remove item from order', () => {
      order.addItem(orderItem);
      order.removeItem(orderItem.getId());
      expect(order.getItems()).toHaveLength(0);
      expect(order.getTotalAmount()).toBe(0);
    });

    it('should not add item to non-pending order', () => {
      order.addItem(orderItem);
      order.confirm();
      expect(() => order.addItem(orderItem)).toThrow(InvalidArgumentError);
    });

    it('should not remove item from non-pending order', () => {
      order.addItem(orderItem);
      order.confirm();
      expect(() => order.removeItem(orderItem.getId())).toThrow(InvalidArgumentError);
    });
  });

  describe('Order Status Management', () => {
    let order: Order;
    let orderItem: OrderItem;

    beforeEach(() => {
      order = new Order(validCustomerId);
      orderItem = new OrderItem(validProductId, 2, 10);
      order.addItem(orderItem);
    });

    it('should confirm valid order', () => {
      order.confirm();
      expect(order.getStatus()).toBe(OrderStatus.CONFIRMED);
    });

    it('should not confirm empty order', () => {
      const emptyOrder = new Order(validCustomerId);
      expect(() => emptyOrder.confirm()).toThrow(InvalidArgumentError);
    });

    it('should not confirm non-pending order', () => {
      order.confirm();
      expect(() => order.confirm()).toThrow(InvalidArgumentError);
    });

    it('should cancel pending order', () => {
      order.cancel();
      expect(order.getStatus()).toBe(OrderStatus.CANCELLED);
    });

    it('should not cancel delivered order', () => {
      order.confirm();
      order.deliver();
      expect(() => order.cancel()).toThrow(InvalidArgumentError);
    });

    it('should deliver confirmed order', () => {
      order.confirm();
      order.deliver();
      expect(order.getStatus()).toBe(OrderStatus.DELIVERED);
    });

    it('should not deliver unconfirmed order', () => {
      expect(() => order.deliver()).toThrow(InvalidArgumentError);
    });
  });
});