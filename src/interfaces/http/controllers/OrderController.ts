import { Request, Response } from 'express';
import { CreateOrder } from '../../../application/use-cases/CreateOrder';
import { OrderDomainService } from '../../../domain/services/OrderDomainService';
import { DomainError } from '../../../shared/errors/DomainError';

export class OrderController {
  private createOrderUseCase: CreateOrder;
  private orderDomainService: OrderDomainService;

  constructor(createOrderUseCase: CreateOrder, orderDomainService: OrderDomainService) {
    this.createOrderUseCase = createOrderUseCase;
    this.orderDomainService = orderDomainService;
  }

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderCreated = await this.createOrderUseCase.execute(req.body);
      res.status(201).json(orderCreated.toJSON());
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.orderDomainService.getOrderById(req.params.orderId);
      res.json({
        id: order.getId(),
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
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getCustomerOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderDomainService.getOrdersByCustomerId(req.params.customerId);
      res.json(orders.map(order => ({
        id: order.getId(),
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
      })));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async confirmOrder(req: Request, res: Response): Promise<void> {
    try {
      await this.orderDomainService.confirmOrder(req.params.orderId);
      res.status(200).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      await this.orderDomainService.cancelOrder(req.params.orderId);
      res.status(200).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async deliverOrder(req: Request, res: Response): Promise<void> {
    try {
      await this.orderDomainService.deliverOrder(req.params.orderId);
      res.status(200).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    if (error instanceof DomainError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}