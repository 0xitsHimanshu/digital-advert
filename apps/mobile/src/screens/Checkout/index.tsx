import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRazorpayCheckout } from "@/src/hooks/use-razorpay-checkout";
import { computeCartTotals } from "@/src/lib/cart-totals";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { CartItemCard } from "@/src/screens/Cart/components/cart-item-card";
import { OrderSummary } from "@/src/screens/Cart/components/order-summary";
import { PayNowBar } from "@/src/screens/Cart/components/pay-now-bar";
import { selectCartItemCount, useCart } from "@/src/stores/cart";

const DESIGN_W = 1080;
const H_PAD = 52;

function CheckoutSuccess({
  orderId,
  s,
  padH,
  insets,
  onHome,
}: {
  orderId: string;
  s: (v: number) => number;
  padH: number;
  insets: { top: number; bottom: number };
  onHome: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + s(80),
          paddingHorizontal: padH,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: s(120),
            height: s(120),
            borderRadius: s(60),
            backgroundColor: "#e8f5e9",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: s(32),
          }}
        >
          <Ionicons name="checkmark-circle" size={s(80)} color="#2e7d32" />
        </View>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: s(48),
            color: "#1e1e1e",
            textAlign: "center",
            letterSpacing: -s(1.2),
          }}
        >
          Payment successful
        </Text>
        <Text
          style={{
            marginTop: s(16),
            fontFamily: "Poppins_400Regular",
            fontSize: s(28),
            color: "#9f9f9f",
            textAlign: "center",
          }}
        >
          Order {orderId.slice(0, 8)}… is confirmed. Our team will reach out shortly.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={onHome}
          style={{
            marginTop: s(48),
            paddingHorizontal: s(48),
            paddingVertical: s(20),
            borderRadius: s(62),
            backgroundColor: "#165d75",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(30),
              color: "#fff",
            }}
          >
            Back to home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ paid?: string; orderId?: string }>();
  const paid = params.paid === "1";
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const padH = s(H_PAD);

  const lines = useCart((state) => state.lines);
  const itemCount = useCart(selectCartItemCount);
  const setQuantity = useCart((state) => state.setQuantity);
  const removeService = useCart((state) => state.removeService);
  const syncFromCatalog = useCart((state) => state.syncFromCatalog);

  useFocusEffect(
    useCallback(() => {
      void syncFromCatalog();
    }, [syncFromCatalog]),
  );

  const totals = useMemo(
    () => computeCartTotals(lines, null, false),
    [lines],
  );

  const { payNow, paying } = useRazorpayCheckout({
    lines,
    totals,
    selectedCoupon: null,
    adDiscountUnlocked: false,
  });

  const payBarBottom = insets.bottom + s(16);
  const scrollBottomPad = itemCount > 0 ? payBarBottom + s(140) : insets.bottom + s(40);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home-tab");
    }
  }, [router]);

  const browseServices = useCallback(() => {
    router.push("/(tabs)/search-tab");
  }, [router]);

  if (paid && orderId) {
    return (
      <CheckoutSuccess
        orderId={orderId}
        s={s}
        padH={padH}
        insets={insets}
        onHome={() => router.replace("/(tabs)/home-tab")}
      />
    );
  }

  const canPay = itemCount > 0 && totals.totalCents > 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <CartBackground s={s} width={width} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + s(24),
          paddingHorizontal: padH,
          paddingBottom: scrollBottomPad,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: s(32),
            minHeight: s(52),
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={handleBack}
            style={{
              width: s(46),
              height: s(46),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={s(32)} color="#1e1e1e" />
          </Pressable>

          <Text
            accessibilityRole="header"
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "Poppins_500Medium",
              fontSize: s(52),
              color: "#1e1e1e",
              letterSpacing: -s(1.29),
              textTransform: "lowercase",
              marginRight: s(46),
            }}
          >
            checkout
          </Text>
        </View>

        {itemCount === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: s(80),
              paddingBottom: s(120),
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(32),
                color: "#1e1e1e",
                textAlign: "center",
              }}
            >
              Nothing to checkout
            </Text>
            <Text
              style={{
                marginTop: s(12),
                fontFamily: "Poppins_400Regular",
                fontSize: s(24),
                color: "#9f9f9f",
                textAlign: "center",
              }}
            >
              Add a service from the catalog, or use Buy now on a service page.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Browse services"
              onPress={browseServices}
              style={{
                marginTop: s(32),
                paddingHorizontal: s(40),
                paddingVertical: s(18),
                borderRadius: s(62),
                backgroundColor: "#165d75",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(28),
                  color: "#fff",
                }}
              >
                Browse services
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={{ gap: s(30) }}>
              {lines.map((line) => (
                <CartItemCard
                  key={line.serviceId}
                  line={line}
                  s={s}
                  onRemove={() => removeService(line.serviceId)}
                  onDecrement={() => {
                    if (line.quantity > 1) {
                      setQuantity(line.serviceId, line.quantity - 1);
                    }
                  }}
                  onIncrement={() => setQuantity(line.serviceId, line.quantity + 1)}
                />
              ))}
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#e8e8e8",
                marginTop: s(36),
                marginBottom: s(36),
              }}
            />

            <OrderSummary totals={totals} s={s} />

            {!canPay ? (
              <Text
                style={{
                  marginTop: s(24),
                  fontFamily: "Poppins_400Regular",
                  fontSize: s(26),
                  color: "#9f9f9f",
                  textAlign: "center",
                }}
              >
                This service has no listed price. Contact us to complete your order.
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>

      {canPay ? (
        <PayNowBar
          totals={totals}
          paying={paying}
          onPress={payNow}
          s={s}
          bottomInset={payBarBottom}
        />
      ) : null}
    </View>
  );
}
