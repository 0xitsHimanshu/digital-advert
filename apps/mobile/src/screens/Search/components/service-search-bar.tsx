import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  s: (v: number) => number;
};

export function ServiceSearchBar({ value, onChangeText, s }: Props) {
  return (
    <View
      style={{
        height: s(99),
        borderRadius: s(30),
        borderWidth: 1,
        borderColor: "#9c9c9c",
        backgroundColor: "#fffdf8",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: s(28),
        paddingRight: s(20),
        borderCurve: "continuous",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="What service you are looking for?"
        placeholderTextColor="#acacac"
        accessibilityLabel="Search services"
        accessibilityHint="Filters services by title and description"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={{
          flex: 1,
          fontFamily: "Poppins_400Regular",
          fontSize: s(35),
          color: "#1e1e1e",
          letterSpacing: -s(1.29),
          paddingVertical: 0,
        }}
      />
      <Ionicons
        name="search"
        size={s(43)}
        color="#1e1e1e"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </View>
  );
}
