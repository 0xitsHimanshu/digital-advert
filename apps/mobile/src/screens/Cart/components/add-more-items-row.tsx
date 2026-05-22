import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type AddMoreItemsRowProps = {
  onPress: () => void;
  s: (v: number) => number;
};

/** Figma 2243:417–423 — right-aligned “Add more items” + bordered plus. */
export function AddMoreItemsRow({ onPress, s }: AddMoreItemsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add more items"
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: s(12),
        paddingVertical: s(8),
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: s(25),
          color: "#313131",
          letterSpacing: -s(1.4),
        }}
      >
        Add more items
      </Text>
      <View
        style={{
          width: s(36),
          height: s(36),
          borderRadius: s(10),
          borderWidth: s(0.632),
          borderColor: "#313131",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={s(17)} color="#313131" />
      </View>
    </Pressable>
  );
}
