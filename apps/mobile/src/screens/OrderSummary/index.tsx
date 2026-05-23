import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { useServicesCatalog } from "@/src/hooks/use-services-catalog";
import { formatOrderSummaryDate } from "@/src/lib/format-order-summary-date";
import { maskOrderId } from "@/src/lib/mask-order-id";
import { fetchOrderById } from "@/src/services/orders-api";
import { OtpFooterDoodle, otpFooterScrollPadding } from "@/src/components/otp-footer-doodle";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { OrderSummaryBackgroundDeco } from "@/src/screens/OrderSummary/components/order-summary-deco";
import { OrderSummaryPriceBreakdown } from "@/src/screens/OrderSummary/components/order-summary-price-breakdown";
import { SummarySectionCard } from "@/src/screens/OrderSummary/components/summary-section-card";
import type { CustomerOrder } from "@/src/types/order";

const DESIGN_W = 1080;
/** Slightly larger type for readability on device. */
const FONT_SCALE = 1.22;

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const t = (v: number) => s(v * FONT_SCALE);

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const { services } = useServicesCatalog("");

  const serviceById = useMemo(() => {
    const map = new Map<string, (typeof services)[number]>();
    for (const svc of services) {
      map.set(svc.id, svc);
    }
    return map;
  }, [services]);

  const loadOrder = useCallback(async () => {
    if (!orderId?.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { order: loaded } = await fetchOrderById(orderId);
      setOrder(loaded);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const primaryLine = order?.lines[0];
  const catalog = primaryLine ? serviceById.get(primaryLine.serviceId) : undefined;
  const imageUrl = catalog?.imageUrl;
  const title = primaryLine?.title ?? "Service";
  const totalQty = order?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
  const orderedOn = order
    ? formatOrderSummaryDate(order.paidAt ?? order.createdAt)
    : "";

  const contactUpdate = order?.updates?.find((u) =>
    u.title.toLowerCase().includes("updates sent"),
  );
  const statusUpdates =
    order?.updates?.filter((u) => !u.title.toLowerCase().includes("updates sent")) ?? [];

  const padH = s(52);
  const scale = width / DESIGN_W;
  const scrollBottomPad = otpFooterScrollPadding(scale, insets.bottom);

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <CartBackground s={s} width={width} />
      <OrderSummaryBackgroundDeco s={s} width={width} />

      <View
        style={{
          paddingTop: insets.top + s(16),
          paddingHorizontal: padH,
          flexDirection: "row",
          alignItems: "center",
          gap: s(12),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{
            width: s(46),
            height: s(46),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={t(40)} color="#165d75" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: t(52),
            lineHeight: t(58),
            letterSpacing: s(-1.29),
            color: "#1e1e1e",
            textTransform: "capitalize",
          }}
        >
          Order Summary
        </Text>
        <View pointerEvents="none" style={{ width: s(60), height: s(40) }}>
          <Svg width="100%" height="100%" viewBox="0 0 60 40" fill="none">
            <Path
              d="M4 30C18 14 34 10 54 18"
              stroke="#2066AC"
              strokeOpacity={0.3}
              strokeWidth={2}
            />
          </Svg>
        </View>
      </View>

      {status === "loading" ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#165d75" size="large" />
        </View>
      ) : status === "error" || !order ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: padH,
            alignItems: "center",
            justifyContent: "center",
            gap: s(16),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: t(28),
              color: "#919191",
              textAlign: "center",
            }}
          >
            Could not load this order.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={{
              paddingHorizontal: s(32),
              paddingVertical: s(14),
              borderRadius: s(35),
              backgroundColor: "#165d75",
            }}
          >
            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: t(26), color: "#fff" }}>
              Go Back
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: padH,
            paddingTop: s(20),
            paddingBottom: scrollBottomPad,
            alignItems: "center",
            gap: s(24),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: s(213),
              height: s(202),
              borderRadius: s(40),
              backgroundColor: "#c4c4c4",
              overflow: "hidden",
              shadowColor: "#000000",
              shadowOffset: { width: s(3), height: s(4) },
              shadowOpacity: 0.04,
              shadowRadius: s(15),
            }}
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : null}
          </View>

          <View style={{ alignItems: "center", gap: s(10) }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: t(40),
                lineHeight: t(52),
                letterSpacing: s(-1.5),
                color: "#1e1e1e",
                textTransform: "capitalize",
                textAlign: "center",
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: t(28),
                lineHeight: t(34),
                color: "#404040",
                textTransform: "capitalize",
              }}
            >
              Quantity: {totalQty}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: t(28),
                lineHeight: t(34),
                color: "#404040",
                textTransform: "capitalize",
              }}
            >
              Order id: {maskOrderId(order.id)}
            </Text>
          </View>

          <View style={{ alignSelf: "stretch", gap: s(20) }}>
            <OrderSummaryPriceBreakdown order={order} s={t} />

            {contactUpdate ? (
              <SummarySectionCard s={s} borderRadius={30} minHeight={189}>
                <View style={{ flexDirection: "row", gap: s(16) }}>
                  <View
                    style={{
                      width: s(65),
                      height: s(61),
                      borderRadius: s(14),
                      backgroundColor: "#d9d9d9",
                    }}
                  />
                  <View style={{ flex: 1, gap: s(10) }}>
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: t(30),
                        lineHeight: t(40),
                        color: "#1e1e1e",
                        textTransform: "capitalize",
                      }}
                    >
                      {contactUpdate.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: t(22),
                        color: "#404040",
                        textTransform: "capitalize",
                      }}
                    >
                      {contactUpdate.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: t(24),
                        color: "#000000",
                      }}
                    >
                      {contactUpdate.value}
                    </Text>
                  </View>
                </View>
              </SummarySectionCard>
            ) : null}

            {statusUpdates.map((update) => (
              <SummarySectionCard key={update.id} s={s} borderRadius={30} minHeight={189}>
                <View style={{ flexDirection: "row", gap: s(16) }}>
                  <View
                    style={{
                      width: s(65),
                      height: s(61),
                      borderRadius: s(14),
                      backgroundColor: "#d9d9d9",
                    }}
                  />
                  <View style={{ flex: 1, gap: s(10) }}>
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: t(30),
                        lineHeight: t(40),
                        color: "#1e1e1e",
                        textTransform: "capitalize",
                      }}
                    >
                      {update.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: t(22),
                        color: "#404040",
                        textTransform: "capitalize",
                      }}
                    >
                      {update.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_500Medium",
                        fontSize: t(24),
                        color: "#000000",
                      }}
                    >
                      {update.value}
                    </Text>
                  </View>
                </View>
              </SummarySectionCard>
            ))}

            <SummarySectionCard s={s} borderRadius={30} minHeight={189}>
              <View style={{ flexDirection: "row", gap: s(16) }}>
                <View
                  style={{
                    width: s(65),
                    height: s(61),
                    borderRadius: s(14),
                    backgroundColor: "#d9d9d9",
                  }}
                />
                <View style={{ flex: 1, gap: s(14) }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: t(30),
                      lineHeight: t(40),
                      color: "#1e1e1e",
                      textTransform: "capitalize",
                    }}
                  >
                    Order Details
                  </Text>
                  <View style={{ flexDirection: "row", gap: s(32) }}>
                    <View style={{ gap: s(8) }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: t(20),
                          color: "#404040",
                          textTransform: "capitalize",
                        }}
                      >
                        Ordered On:
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: t(22),
                          color: "#000000",
                          textTransform: "capitalize",
                        }}
                      >
                        {orderedOn}
                      </Text>
                    </View>
                    <View style={{ flex: 1, gap: s(8) }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: t(20),
                          color: "#404040",
                          textTransform: "capitalize",
                        }}
                      >
                        Order ID:
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: t(22),
                          color: "#000000",
                        }}
                      >
                        #{maskOrderId(order.id)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </SummarySectionCard>
          </View>

        </ScrollView>
      )}

      <OtpFooterDoodle scale={scale} />
    </View>
  );
}
