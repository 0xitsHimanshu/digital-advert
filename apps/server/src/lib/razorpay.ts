import crypto from "node:crypto";

import Razorpay from "razorpay";

export function getRazorpayConfig(): {
  keyId: string;
  keySecret: string;
} | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export function createRazorpayClient(): Razorpay | null {
  const config = getRazorpayConfig();
  if (!config) return null;
  return new Razorpay({
    key_id: config.keyId,
    key_secret: config.keySecret,
  });
}

export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}
