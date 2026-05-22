import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type CouponsSectionProps = {
  onPressSeeAll: () => void;
  s: (v: number) => number;
};

/** Figma COUPONS 2243:425–431 — shadow card, voucher icon, chevron. */
export function CouponsSection({ onPressSeeAll, s }: CouponsSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="See all coupons"
      onPress={onPressSeeAll}
      style={{
        height: s(117),
        borderRadius: s(28),
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: s(29),
        shadowColor: "#000",
        shadowOffset: { width: s(7), height: s(7) },
        shadowOpacity: 0.1,
        shadowRadius: s(14),
        elevation: 4,
        borderCurve: "continuous",
      }}
    >
      <View
        style={{
          width: s(90),
          height: s(90),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            transform: [{ rotate: "-19deg" }],
            backgroundColor: "#ca8a2f",
            borderRadius: s(8),
            paddingHorizontal: s(10),
            paddingVertical: s(6),
          }}
        >
          <Ionicons name="pricetag" size={s(42)} color="#fff8e5" />
        </View>
      </View>

      <Text
        style={{
          flex: 1,
          marginLeft: s(16),
          fontFamily: "Poppins_500Medium",
          fontSize: s(40),
          color: "#1e1e1e",
          letterSpacing: -s(1.5),
        }}
      >
        See all coupons
      </Text>

      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: s(40),
          color: "#1e1e1e",
          letterSpacing: -s(1.5),
        }}
      >
        {">"}
      </Text>
    </Pressable>
  );
}
