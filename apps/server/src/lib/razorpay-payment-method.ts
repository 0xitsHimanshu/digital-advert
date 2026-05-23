import type Razorpay from "razorpay";

type RazorpayPaymentEntity = {
  method?: string;
  bank?: string;
  wallet?: string;
  card?: { network?: string; last4?: string; type?: string };
};

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/** Maps Razorpay `payment.method` to UI copy (e.g. "Card", "UPI"). */
export function formatRazorpayPaymentMethod(
  payment: RazorpayPaymentEntity,
): string {
  const method = payment.method?.toLowerCase().trim();
  if (!method) return "Online Payment";

  switch (method) {
    case "card": {
      const network = payment.card?.network?.trim();
      return network ? titleCase(network) : "Card";
    }
    case "upi":
      return "UPI";
    case "netbanking":
      return payment.bank?.trim() || "Net Banking";
    case "wallet":
      return payment.wallet?.trim() ? titleCase(payment.wallet) : "Wallet";
    case "emi":
      return "EMI";
    case "paylater":
      return "Pay Later";
    default:
      return titleCase(method);
  }
}

export async function fetchRazorpayPaymentMethodLabel(
  razorpay: Razorpay,
  paymentId: string,
): Promise<string> {
  const payment = (await razorpay.payments.fetch(paymentId)) as RazorpayPaymentEntity;
  return formatRazorpayPaymentMethod(payment);
}
