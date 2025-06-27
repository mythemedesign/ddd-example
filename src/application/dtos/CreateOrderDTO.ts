export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDTO {
  customerId: string;
  items: CreateOrderItemDTO[];
}

export interface CreateOrderResponseDTO {
  orderId: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  totalAmount: number;
  createdAt: string;
}