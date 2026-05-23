import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { CartTotals } from "@/src/lib/cart-totals";
import {
  getRazorpayCheckout,
  getRazorpayUnavailableReason,
  isRazorpayNativeError,
  RAZORPAY_NATIVE_REBUILD_MESSAGE,
} from "@/src/lib/razorpay-checkout";
import {
  createPaymentOrder,
  formatPaymentsApiError,
  verifyPayment,
} from "@/src/services/payments-api";
import { useCart } from "@/src/stores/cart";
import { useCustomerProfile } from "@/src/stores/customer-profile";
import type { CartCoupon } from "@/src/types/cart-coupon";
import type { CartLine } from "@/src/types/cart";

function getRazorpayKeyFallback(keyIdFromServer: string): string {
  const fromEnv =
    typeof process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID === "string"
      ? process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID.trim()
      : "";
  if (fromEnv) return fromEnv;

  const fromExtra = Constants.expoConfig?.extra?.razorpayKeyId;
  if (typeof fromExtra === "string" && fromExtra.trim()) return fromExtra.trim();

  return keyIdFromServer;
}

type UseRazorpayCheckoutArgs = {
  lines: CartLine[];
  totals: CartTotals;
  selectedCoupon: CartCoupon | null;
  adDiscountUnlocked: boolean;
};

export function useRazorpayCheckout({
  lines,
  totals,
  selectedCoupon,
  adDiscountUnlocked,
}: UseRazorpayCheckoutArgs) {
  const router = useRouter();
  const clearCart = useCart((state) => state.clear);
  const profileName = useCustomerProfile((s) => s.name);
  const profileEmail = useCustomerProfile((s) => s.email);
  const profilePhone = useCustomerProfile((s) => s.phoneNumber);

  const [paying, setPaying] = useState(false);

  const payNow = useCallback(async () => {
    if (paying || lines.length === 0 || totals.totalCents <= 0) return;

    const unavailableReason = getRazorpayUnavailableReason();
    const RazorpayCheckout = getRazorpayCheckout();
    if (unavailableReason || !RazorpayCheckout) {
      Alert.alert("Payments unavailable", unavailableReason ?? RAZORPAY_NATIVE_REBUILD_MESSAGE);
      return;
    }

    setPaying(true);
    try {
      const orderPayload = await createPaymentOrder({
        items: lines.map((l) => ({
          serviceId: l.serviceId,
          quantity: l.quantity,
        })),
        couponCode: selectedCoupon?.code,
        adDiscountUnlocked,
      });

      const key = getRazorpayKeyFallback(orderPayload.keyId);

      const payment = await RazorpayCheckout.open({
        key,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        order_id: orderPayload.razorpayOrderId,
        name: "Digital Advert",
        description:
          lines.length === 1
            ? `Checkout — ${lines[0]!.service.title}`
            : "Cart checkout",
        prefill: {
          name: profileName ?? undefined,
          email: profileEmail ?? undefined,
          contact: profilePhone ?? undefined,
        },
        theme: { color: "#165d75" },
      });

      await verifyPayment({
        orderId: orderPayload.orderId,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });

      await clearCart();

      router.push({
        pathname: "/checkout",
        params: {
          paid: "1",
          orderId: orderPayload.orderId,
        },
      });
    } catch (e: unknown) {
      const code =
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        typeof (e as { code: unknown }).code === "number"
          ? (e as { code: number }).code
          : undefined;

      if (code === 0 || code === 2) {
        return;
      }

      const rawMessage =
        e instanceof Error
          ? e.message
          : typeof e === "object" &&
              e !== null &&
              "description" in e &&
              typeof (e as { description: unknown }).description === "string"
            ? (e as { description: string }).description
            : formatPaymentsApiError(e);

      if (isRazorpayNativeError(rawMessage)) {
        Alert.alert("Payments unavailable", RAZORPAY_NATIVE_REBUILD_MESSAGE);
        return;
      }

      Alert.alert("Payment failed", rawMessage);
    } finally {
      setPaying(false);
    }
  }, [
    adDiscountUnlocked,
    clearCart,
    lines,
    paying,
    profileEmail,
    profileName,
    profilePhone,
    router,
    selectedCoupon?.code,
    totals.totalCents,
  ]);

  return { payNow, paying };
}
