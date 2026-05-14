import { Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavbar } from "@/src/components/bottom-navbar";

const DESIGN_W = 1080;

export default function CartScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const navBottom = Math.max(insets.bottom, s(20));

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: s(8) }}>
        <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: s(46), color: "#1e1e1e" }}>
          Cart (Dummy)
        </Text>
        <Text style={{ fontFamily: "Poppins_400Regular", fontSize: s(24), color: "#6b7280" }}>
          Navbar cart icon should be filled.
        </Text>
      </View>
      <BottomNavbar activeTab="cart" s={s} navBottom={navBottom} />
    </View>
  );
}
