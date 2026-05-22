import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CartBackground } from "@/src/screens/Cart/components/cart-background";

const DESIGN_W = 1080;

type ProfilePlaceholderScreenProps = {
  title: string;
  description: string;
};

export default function ProfilePlaceholderScreen({
  title,
  description,
}: ProfilePlaceholderScreenProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <CartBackground s={s} width={width} />
      <View
        style={{
          paddingTop: insets.top + s(24),
          paddingHorizontal: s(52),
          flexDirection: "row",
          alignItems: "center",
          gap: s(16),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{
            width: s(72),
            height: s(72),
            borderRadius: s(36),
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#e0e0e0",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={s(40)} color="#165d75" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontFamily: "Poppins_500Medium",
            fontSize: s(42),
            color: "#1e1e1e",
            textTransform: "capitalize",
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: s(52),
          justifyContent: "center",
          alignItems: "center",
          gap: s(16),
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(36),
            color: "#1e1e1e",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          Coming soon
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
          {description}
        </Text>
      </View>
    </View>
  );
}
