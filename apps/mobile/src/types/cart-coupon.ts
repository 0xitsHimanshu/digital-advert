export type CartCouponKind = "percent" | "fixed";

export type CartCoupon = {
  id: string;
  title: string;
  description: string;
  code: string;
  kind: CartCouponKind;
  /** Percent 0–100 or fixed discount in cents. */
  value: number;
};

export const CART_COUPONS: CartCoupon[] = [
  {
    id: "welcome10",
    title: "Welcome offer",
    description: "10% off your first order",
    code: "WELCOME10",
    kind: "percent",
    value: 10,
  },
  {
    id: "save50",
    title: "Flat savings",
    description: "$50 off when you spend $300+",
    code: "SAVE50",
    kind: "fixed",
    value: 5000,
  },
  {
    id: "bundle15",
    title: "Bundle boost",
    description: "15% off on 3+ services",
    code: "BUNDLE15",
    kind: "percent",
    value: 15,
  },
];
