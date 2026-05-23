import { apiClient } from "@/src/services/api-client";
import type { CustomerOrderResponse, CustomerOrdersResponse } from "@/src/types/order";

export async function fetchCompletedOrders(): Promise<CustomerOrdersResponse> {
  const { data } = await apiClient.get<CustomerOrdersResponse>("/api/payments/orders");
  return data;
}

export async function fetchOrderById(orderId: string): Promise<CustomerOrderResponse> {
  const { data } = await apiClient.get<CustomerOrderResponse>(
    `/api/payments/orders/${encodeURIComponent(orderId)}`,
  );
  return data;
}
