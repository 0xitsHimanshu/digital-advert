import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { formatCartMoney } from "@/src/lib/cart-totals";
import type { CartLine } from "@/src/types/cart";

import { QuantitySelector } from "./quantity-selector";

type CartItemCardProps = {
  line: CartLine;
  s: (v: number) => number;
  onRemove: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
};

/** Figma cart service card — 975×240, white fill, #b7b7b7 border. */
export function CartItemCard({
  line,
  s,
  onRemove,
  onDecrement,
  onIncrement,
}: CartItemCardProps) {
  const unitCents = line.service.priceCents ?? 0;
  const lineTotalCents = unitCents * line.quantity;
  const linePrice =
    lineTotalCents > 0
      ? formatCartMoney(lineTotalCents, line.service.currency)
      : null;

  return (
    <View
      style={{
        height: s(240),
        borderRadius: s(43),
        borderWidth: 1,
        borderColor: "#b7b7b7",
        backgroundColor: "#fff",
        borderCurve: "continuous",
        flexDirection: "row",
        paddingVertical: s(24),
        paddingLeft: s(24),
        paddingRight: s(20),
      }}
    >
      <View
        style={{
          width: s(202),
          height: s(192),
          borderRadius: s(35),
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: s(3), height: s(4) },
          shadowOpacity: 0.04,
          shadowRadius: s(15),
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: line.service.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <View style={{ flex: 1, marginLeft: s(34), justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              flex: 1,
              fontFamily: "Poppins_500Medium",
              fontSize: s(40),
              lineHeight: s(60),
              color: "#1e1e1e",
              textTransform: "capitalize",
              letterSpacing: -s(1.5),
              marginRight: s(8),
            }}
          >
            {line.service.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${line.service.title} from cart`}
            hitSlop={12}
            onPress={onRemove}
            style={{ padding: s(4) }}
          >
            <Ionicons name="close" size={s(28)} color="#9f9f9f" />
          </Pressable>
        </View>

        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(24),
            color: "#9f9f9f",
            letterSpacing: -s(1.5),
            textTransform: "capitalize",
            lineHeight: s(25),
          }}
        >
          qty: {line.quantity}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {linePrice ? (
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(43.432),
                lineHeight: s(60),
                color: "#000",
                letterSpacing: -s(3.6),
                textTransform: "capitalize",
                flexShrink: 1,
              }}
            >
              {linePrice}
            </Text>
          ) : (
            <View />
          )}
          <QuantitySelector
            quantity={line.quantity}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            s={s}
            serviceTitle={line.service.title}
          />
        </View>
      </View>
    </View>
  );
}
