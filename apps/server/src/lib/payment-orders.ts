export type {
  OrderUpdate,
  PaymentOrder,
  PaymentOrderStatus,
} from "./firestore-orders.js";

export {
  createPaymentOrder,
  getPaymentOrderById,
  getPaymentOrderByRazorpayId,
  getPaymentOrderForCustomer,
  listPaidOrdersByCustomer,
  updatePaymentOrder,
} from "./firestore-orders.js";

/** @deprecated Use getPaymentOrderForCustomer or getPaymentOrderById */
export { getPaymentOrderById as getPaymentOrder } from "./firestore-orders.js";
