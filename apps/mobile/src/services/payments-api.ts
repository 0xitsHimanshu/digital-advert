import axios from "axios";

import { apiClient } from "@/src/services/api-client";

export type CreatePaymentOrderPayload = {
  items: { serviceId: string; quantity: number }[];
  couponCode?: string;
  adDiscountUnlocked?: boolean;
};

export type CreatePaymentOrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifyPaymentPayload = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyPaymentResponse = {
  success: boolean;
  order: {
    id: string;
    status: string;
    amountCents: number;
    currency: string;
  };
};

export function formatPaymentsApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (e.response?.status === 503) {
      return "Payments are not configured on the server yet.";
    }
    if (e.response == null) {
      return "Could not reach the server. Check your network and API URL.";
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Payment failed. Please try again.";
}

export async function createPaymentOrder(
  payload: CreatePaymentOrderPayload,
): Promise<CreatePaymentOrderResponse> {
  const { data } = await apiClient.post<CreatePaymentOrderResponse>(
    "/api/payments/create-order",
    payload,
  );
  return data;
}

export async function verifyPayment(
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> {
  const { data } = await apiClient.post<VerifyPaymentResponse>(
    "/api/payments/verify",
    {
      orderId: payload.orderId,
      razorpay_order_id: payload.razorpayOrderId,
      razorpay_payment_id: payload.razorpayPaymentId,
      razorpay_signature: payload.razorpaySignature,
    },
  );
  return data;
}
