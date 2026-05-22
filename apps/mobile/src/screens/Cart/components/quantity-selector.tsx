import { Pressable, Text, View } from "react-native";

type QuantitySelectorProps = {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  s: (v: number) => number;
  serviceTitle: string;
};

/** Figma 2243:329–333 — bordered minus, qty value, teal plus. */
export function QuantitySelector({
  quantity,
  onDecrement,
  onIncrement,
  s,
  serviceTitle,
}: QuantitySelectorProps) {
  const btnSize = s(57);
  const btnRadius = s(16);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: s(43) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${serviceTitle} quantity`}
        hitSlop={8}
        onPress={onDecrement}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnRadius,
          borderWidth: 1,
          borderColor: "#d0d0d0",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(30),
            color: "#1e1e1e",
            lineHeight: s(36),
            marginTop: -s(4),
          }}
        >
          _
        </Text>
      </Pressable>

      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: s(30),
          color: "#1e1e1e",
          minWidth: s(24),
          textAlign: "center",
          letterSpacing: -s(1.5),
        }}
      >
        {quantity}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${serviceTitle} quantity`}
        hitSlop={8}
        onPress={onIncrement}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnRadius,
          backgroundColor: "#166680",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(30),
            color: "#fff",
            lineHeight: s(32),
          }}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}
