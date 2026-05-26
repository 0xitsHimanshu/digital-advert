/** Admin user record — `admins/{uid}` */
export type AdminUser = {
  uid: string;
  email: string;
  role: "admin" | "super_admin";
  displayName?: string;
  active: boolean;
  createdAt: string;
};

/** Extended customer profile stored in `customers/{uid}` */
export type CustomerProfile = {
  uid: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  avatarUrl: string;
  updatedAt: string;
  /** ISO — first profile creation or auth signup */
  signupAt?: string;
  /** ISO — last app interaction (synced from mobile) */
  lastActiveAt?: string;
};

export type CatalogService = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  isAvailable: boolean;
  category?: string;
  sortOrder: number;
  metadata?: Record<string, string>;
};

export type PaymentOrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PAYMENT_FAILED";

export type PricedCartLine = {
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

export type PaymentOrder = {
  id: string;
  customerId: string;
  razorpayOrderId: string;
  amountCents: number;
  currency: string;
  status: PaymentOrderStatus;
  lines: PricedCartLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  createdAt: string;
  paidAt?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  updates?: OrderUpdate[];
  couponCode?: string;
};

export type CouponType = "percentage" | "fixed";

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  /** Percentage 0–100 or fixed amount in cents */
  value: number;
  minSubtotalCents?: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  redeemedBy: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerCartSnapshot = {
  customerId: string;
  lines: Array<{
    serviceId: string;
    quantity: number;
    title?: string;
    unitPriceCents?: number;
  }>;
  currency: string;
  estimatedTotalCents: number;
  updatedAt: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type ActivityLog = {
  id: string;
  customerId: string;
  type: string;
  label: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type UserListItem = CustomerProfile & {
  orderCount: number;
  totalSpentCents: number;
  lastOrderAt?: string;
  cartItemCount: number;
  activityCount: number;
};

export type AnalyticsSummary = {
  totalUsers: number;
  activeUsers30d: number;
  totalRevenueCents: number;
  pendingCarts: number;
  couponRedemptions: number;
  topServices: Array<{ serviceId: string; title: string; quantity: number; revenueCents: number }>;
  ordersByStatus: Record<PaymentOrderStatus, number>;
  revenueByDay: Array<{ date: string; revenueCents: number; orderCount: number }>;
};
