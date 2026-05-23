import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { formatOrderGeneratedAt } from "@/src/lib/format-order-generated";
import { maskOrderId } from "@/src/lib/mask-order-id";
import type { CustomerOrder } from "@/src/types/order";

type OrderCardProps = {
  order: CustomerOrder;
  imageUrl?: string | null;
  description?: string;
  showOrderId?: boolean;
  s: (v: number) => number;
  onViewDetails?: () => void;
};

export function OrderCard({
  order,
  imageUrl,
  description,
  showOrderId = false,
  s,
  onViewDetails,
}: OrderCardProps) {
  const primaryLine = order.lines[0];
  const title = primaryLine?.title ?? "Service";
  const desc =
    description ??
    (order.lines.length > 1
      ? `${order.lines.length} services in this order`
      : "Your completed order");
  const generatedLabel = formatOrderGeneratedAt(order.paidAt ?? order.createdAt);

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: s(30),
        borderWidth: 1,
        borderColor: "#d0c9c9",
        paddingHorizontal: s(31),
        paddingTop: s(25),
        paddingBottom: s(28),
        gap: s(18),
        borderCurve: "continuous",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: s(12) }}>
        <Text
          style={{
            flex: 1,
            fontFamily: "Poppins_500Medium",
            fontSize: s(29.167),
            lineHeight: s(50),
            letterSpacing: s(-1.25),
            color: "#1e1e1e",
          }}
        >
          Order Generated On: {generatedLabel}
        </Text>
        {showOrderId ? (
          <View
            style={{
              backgroundColor: "#f4f4f4",
              borderRadius: s(32.745),
              paddingHorizontal: s(16),
              paddingVertical: s(8),
              maxWidth: s(281),
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: s(21.667),
                lineHeight: s(36),
                letterSpacing: s(-2.16),
                color: "#404040",
              }}
            >
              Order id: {maskOrderId(order.id)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", gap: s(20), alignItems: "flex-start" }}>
        <View
          style={{
            width: s(193),
            height: s(176),
            borderRadius: s(30),
            backgroundColor: "#c4c4c4",
            overflow: "hidden",
            shadowColor: "#000000",
            shadowOffset: { width: s(3), height: s(4) },
            shadowOpacity: 0.04,
            shadowRadius: s(15),
            elevation: 2,
            borderCurve: "continuous",
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

        <View style={{ flex: 1, gap: s(10), minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(35),
              lineHeight: s(48),
              letterSpacing: s(-1.5),
              color: "#1e1e1e",
              textTransform: "capitalize",
            }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: s(18),
              lineHeight: s(25),
              letterSpacing: s(-1.5),
              color: "#9f9f9f",
              textTransform: "capitalize",
            }}
          >
            {desc}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}>
            <Ionicons name="checkmark-circle" size={s(21)} color="#166680" />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: s(18),
                lineHeight: s(25),
                letterSpacing: s(-1.5),
                color: "#000000",
                textTransform: "capitalize",
              }}
            >
              Completed
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View order details"
        onPress={onViewDetails}
        disabled={!onViewDetails}
        style={({ pressed }) => ({
          height: s(99),
          borderRadius: s(24),
          overflow: "hidden",
          opacity: pressed && onViewDetails ? 0.92 : 1,
        })}
      >
        <LinearGradient
          colors={["#166680", "#165d75"]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(35),
              lineHeight: s(48.5),
              letterSpacing: s(-1.26),
              color: "#ffffff",
              textTransform: "capitalize",
            }}
          >
            View Details
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
