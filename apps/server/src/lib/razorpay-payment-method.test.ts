import { describe, expect, it } from "vitest";

import { formatRazorpayPaymentMethod } from "./razorpay-payment-method.js";

describe("formatRazorpayPaymentMethod", () => {
  it("maps card network", () => {
    expect(
      formatRazorpayPaymentMethod({
        method: "card",
        card: { network: "Visa", last4: "1111" },
      }),
    ).toBe("Visa");
  });

  it("maps card without network", () => {
    expect(formatRazorpayPaymentMethod({ method: "card" })).toBe("Card");
  });

  it("maps upi", () => {
    expect(formatRazorpayPaymentMethod({ method: "upi" })).toBe("UPI");
  });

  it("maps netbanking", () => {
    expect(
      formatRazorpayPaymentMethod({ method: "netbanking", bank: "HDFC" }),
    ).toBe("HDFC");
  });
});
