import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import { verifyRazorpayPaymentSignature } from "./razorpay.js";

describe("verifyRazorpayPaymentSignature", () => {
  it("accepts a valid HMAC signature", () => {
    const secret = "test_secret";
    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(
      verifyRazorpayPaymentSignature(orderId, paymentId, signature, secret),
    ).toBe(true);
  });

  it("rejects an invalid signature", () => {
    expect(
      verifyRazorpayPaymentSignature("order_a", "pay_b", "bad", "secret"),
    ).toBe(false);
  });
});
