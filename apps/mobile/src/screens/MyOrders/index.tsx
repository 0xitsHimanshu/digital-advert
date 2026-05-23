import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { BottomNavbar, getBottomNavbarPillMetrics } from "@/src/components/bottom-navbar";
import { useServicesCatalog } from "@/src/hooks/use-services-catalog";
import { fetchCompletedOrders } from "@/src/services/orders-api";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { OrderCard } from "@/src/screens/MyOrders/components/order-card";
import type { CustomerOrder } from "@/src/types/order";

const DESIGN_W = 1080;

export default function MyOrdersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const { services } = useServicesCatalog("");

  const serviceById = useMemo(() => {
    const map = new Map<string, (typeof services)[number]>();
    for (const svc of services) {
      map.set(svc.id, svc);
    }
    return map;
  }, [services]);

  const padH = s(52);
  const { barH: navbarH } = getBottomNavbarPillMetrics(width, s);
  const navBottom = Math.max(insets.bottom, s(20));
  const scrollBottom = navBottom + navbarH + s(32);

  const loadOrders = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchCompletedOrders();
      setOrders(data.orders);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const openOrderDetails = useCallback(
    (order: CustomerOrder) => {
      router.push({ pathname: "/order/[id]", params: { id: order.id } });
    },
    [router],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <CartBackground s={s} width={width} />

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
          <Ionicons name="chevron-back" size={s(40)} color="#165d75" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(52),
            lineHeight: s(58),
            letterSpacing: s(-1.29),
            color: "#1e1e1e",
            textTransform: "capitalize",
          }}
        >
          My Orders
        </Text>
        <View
          pointerEvents="none"
          style={{
            width: s(80),
            height: s(40),
            marginLeft: s(4),
          }}
        >
          <Svg width="100%" height="100%" viewBox="0 0 80 40" fill="none">
            <Path
              d="M8 28C22 12 38 8 58 14C68 17 74 22 72 28"
              stroke="#2066AC"
              strokeOpacity={0.25}
              strokeWidth={2}
            />
          </Svg>
        </View>
      </View>

      {status === "loading" ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#165d75" size="large" />
        </View>
      ) : status === "error" ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: padH,
            alignItems: "center",
            justifyContent: "center",
            gap: s(20),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: s(28),
              color: "#919191",
              textAlign: "center",
            }}
          >
            Could not load your orders. Check your connection and try again.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry"
            onPress={() => void loadOrders()}
            style={{
              paddingHorizontal: s(32),
              paddingVertical: s(16),
              borderRadius: s(35),
              backgroundColor: "#165d75",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(28),
                color: "#ffffff",
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: padH,
            paddingTop: s(24),
            paddingBottom: scrollBottom,
            gap: s(32),
          }}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <View
              style={{
                paddingVertical: s(80),
                alignItems: "center",
                gap: s(12),
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(36),
                  color: "#1e1e1e",
                  textAlign: "center",
                }}
              >
                No completed orders yet
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: s(24),
                  color: "#919191",
                  textAlign: "center",
                  lineHeight: s(34),
                  maxWidth: s(800),
                }}
              >
                When you complete a purchase, it will show up here.
              </Text>
            </View>
          ) : (
            orders.map((order, index) => {
              const line = order.lines[0];
              const catalog = line ? serviceById.get(line.serviceId) : undefined;
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  description={catalog?.description}
                  imageUrl={catalog?.imageUrl}
                  showOrderId={index === 0}
                  s={s}
                  onViewDetails={() => openOrderDetails(order)}
                />
              );
            })
          )}
        </ScrollView>
      )}

      <BottomNavbar activeTab="profile" s={s} navBottom={navBottom} />
    </View>
  );
}
