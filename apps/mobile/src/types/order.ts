export type OrderLine = {
  serviceId: string;
  quantity: number;
  title: string;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type OrderUpdate = {
  id: string;
  title: string;
  label: string;
  value: string;
  createdAt: string;
};

export type CustomerOrder = {
  id: string;
  /** Firebase uid — same as the signed-in user (JWT `sub`). */
  customerId: string;
  razorpayOrderId: string;
  amountCents: number;
  currency: string;
  status: "PAID" | "PAYMENT_PENDING" | "PAYMENT_FAILED" | "CREATED";
  lines: OrderLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: string;
  updates?: OrderUpdate[];
};

export type CustomerOrdersResponse = {
  count: number;
  orders: CustomerOrder[];
};

export type CustomerOrderResponse = {
  order: CustomerOrder;
};
