import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { formatCartMoney } from "@/src/lib/cart-totals";
import type { CartTotals } from "@/src/lib/cart-totals";

type PayNowBarProps = {
  totals: CartTotals;
  paying: boolean;
  onPress: () => void;
  s: (v: number) => number;
  bottomInset: number;
};

/** Fixed CTA above bottom nav — matches service detail “buy now” styling. */
export function PayNowBar({ totals, paying, onPress, s, bottomInset }: PayNowBarProps) {
  const label = formatCartMoney(totals.totalCents, totals.currency);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: s(52),
        right: s(52),
        bottom: bottomInset,
      }}
    >
      <Pressable
        disabled={paying}
        accessibilityRole="button"
        accessibilityLabel={`Pay now, ${label}`}
        accessibilityState={{ disabled: paying, busy: paying }}
        onPress={onPress}
        style={({ pressed }) => ({
          height: s(120),
          borderRadius: s(73),
          backgroundColor: "#165d75",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: s(32),
          opacity: paying ? 0.85 : pressed ? 0.94 : 1,
          shadowColor: "#165d75",
          shadowOffset: { width: 0, height: s(4) },
          shadowOpacity: 0.35,
          shadowRadius: s(16),
          elevation: 6,
        })}
      >
        {paying ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: s(40),
                lineHeight: s(49),
                color: "#fff",
                letterSpacing: -s(1.26),
                textTransform: "capitalize",
              }}
            >
              pay now
            </Text>
            <Text
              style={{
                marginLeft: s(16),
                fontFamily: "Poppins_500Medium",
                fontSize: s(32),
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {label}
            </Text>
            <View
              style={{
                position: "absolute",
                right: s(24),
                width: s(67),
                height: s(67),
                borderRadius: s(34),
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="arrow-forward"
                size={s(32)}
                color="#165d75"
                style={{ transform: [{ rotate: "-45deg" }] }}
              />
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
}
