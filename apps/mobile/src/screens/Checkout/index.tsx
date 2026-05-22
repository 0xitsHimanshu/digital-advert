import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatServicePrice } from "@/src/lib/format-price";
import { selectCartItemCount, useCart } from "@/src/stores/cart";

const DESIGN_W = 1080;

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ paid?: string; orderId?: string }>();
  const paid = params.paid === "1";
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const padH = s(52);

  const lines = useCart((state) => state.lines);
  const itemCount = useCart(selectCartItemCount);

  if (paid && orderId) {
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
            Order {orderId.slice(0, 8)}… is confirmed. Our team will reach out
            shortly.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            onPress={() => router.replace("/(tabs)/home-tab")}
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + s(24),
          paddingHorizontal: padH,
          paddingBottom: insets.bottom + s(40),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start", marginBottom: s(24) }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(28),
              color: "#165d75",
            }}
          >
            Back
          </Text>
        </Pressable>

        <Text
          accessibilityRole="header"
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: s(52),
            color: "#1e1e1e",
            letterSpacing: -s(1.3),
            textTransform: "capitalize",
            marginBottom: s(32),
          }}
        >
          checkout
        </Text>

        {itemCount === 0 ? (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: s(28),
              color: "#9f9f9f",
            }}
          >
            Your cart is empty. Add services before checkout.
          </Text>
        ) : (
          <View style={{ gap: s(20) }}>
            {lines.map((line) => {
              const price = formatServicePrice(
                line.service.priceCents,
                line.service.currency,
              );
              return (
                <View
                  key={line.serviceId}
                  style={{
                    padding: s(20),
                    borderRadius: s(24),
                    backgroundColor: "#fffcf3",
                    borderWidth: 1,
                    borderColor: "#f4c442",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: s(32),
                      color: "#1e1e1e",
                      textTransform: "capitalize",
                    }}
                  >
                    {line.service.title} × {line.quantity}
                  </Text>
                  {price ? (
                    <Text
                      style={{
                        marginTop: s(8),
                        fontFamily: "Poppins_400Regular",
                        fontSize: s(26),
                        color: "#165d75",
                      }}
                    >
                      {price}
                    </Text>
                  ) : null}
                </View>
              );
            })}
            <Text
              style={{
                marginTop: s(16),
                fontFamily: "Poppins_400Regular",
                fontSize: s(24),
                color: "#9f9f9f",
              }}
            >
              Use Pay now on the cart screen to complete payment with Razorpay.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
