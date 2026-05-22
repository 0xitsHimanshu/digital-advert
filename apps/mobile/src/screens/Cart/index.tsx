import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavbar, getBottomNavbarPillMetrics } from "@/src/components/bottom-navbar";
import { useRazorpayCheckout } from "@/src/hooks/use-razorpay-checkout";
import { computeCartTotals } from "@/src/lib/cart-totals";
import { selectCartItemCount, useCart } from "@/src/stores/cart";
import type { CartCoupon } from "@/src/types/cart-coupon";

import { AddMoreItemsRow } from "./components/add-more-items-row";
import { CartBackground } from "./components/cart-background";
import { CartItemCard } from "./components/cart-item-card";
import { CouponsModal } from "./components/coupons-modal";
import { CouponsSection } from "./components/coupons-section";
import { OrderSummary } from "./components/order-summary";
import { PayNowBar } from "./components/pay-now-bar";

const DESIGN_W = 1080;
const H_PAD = 52;

export default function CartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const padH = s(H_PAD);
  const navBottom = Math.max(insets.bottom, s(20));
  const { barH: navbarH } = getBottomNavbarPillMetrics(width, s);

  const lines = useCart((state) => state.lines);
  const itemCount = useCart(selectCartItemCount);
  const setQuantity = useCart((state) => state.setQuantity);
  const removeService = useCart((state) => state.removeService);

  const [couponsVisible, setCouponsVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CartCoupon | null>(null);
  const [adDiscountUnlocked, setAdDiscountUnlocked] = useState(false);

  const totals = useMemo(
    () => computeCartTotals(lines, selectedCoupon, adDiscountUnlocked),
    [adDiscountUnlocked, lines, selectedCoupon],
  );

  const { payNow, paying } = useRazorpayCheckout({
    lines,
    totals,
    selectedCoupon,
    adDiscountUnlocked,
  });

  const payBarBottom = navbarH + navBottom + s(24);
  const scrollBottomPad =
    itemCount > 0 ? payBarBottom + s(140) : navbarH + navBottom + s(48);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)/home-tab");
    }
  }, [router]);

  const browseServices = useCallback(() => {
    router.push("/(tabs)/search-tab");
  }, [router]);

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
            my cart
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
              Your cart is empty
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
              Browse services and tap + to add items.
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
                  onIncrement={() =>
                    setQuantity(line.serviceId, line.quantity + 1)
                  }
                />
              ))}
            </View>

            <View style={{ marginTop: s(24) }}>
              <AddMoreItemsRow onPress={browseServices} s={s} />
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#e8e8e8",
                marginTop: s(36),
                marginBottom: s(36),
              }}
            />

            <CouponsSection onPressSeeAll={() => setCouponsVisible(true)} s={s} />

            <View style={{ marginTop: s(30) }}>
              <OrderSummary totals={totals} s={s} />
            </View>
          </>
        )}
      </ScrollView>

      {itemCount > 0 ? (
        <PayNowBar
          totals={totals}
          paying={paying}
          onPress={payNow}
          s={s}
          bottomInset={payBarBottom}
        />
      ) : null}

      <BottomNavbar activeTab="cart" s={s} navBottom={navBottom} />

      <CouponsModal
        visible={couponsVisible}
        selectedCouponId={selectedCoupon?.id ?? null}
        adDiscountUnlocked={adDiscountUnlocked}
        onClose={() => setCouponsVisible(false)}
        onSelectCoupon={setSelectedCoupon}
        onUnlockAdDiscount={() => setAdDiscountUnlocked(true)}
        s={s}
      />
    </View>
  );
}
