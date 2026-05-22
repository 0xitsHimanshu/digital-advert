import {
  Image,
  type ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

type ProfileMenuRowProps = {
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  s: (v: number) => number;
};

export function ProfileMenuRow({
  title,
  subtitle,
  icon,
  onPress,
  s,
}: ProfileMenuRowProps) {
  const iconSize = s(91);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: s(43),
        borderWidth: 1,
        borderColor: "#e0e0e0",
        paddingVertical: s(22),
        paddingHorizontal: s(24),
        gap: s(20),
        opacity: pressed && onPress ? 0.92 : 1,
        borderCurve: "continuous",
      })}
    >
      <Image
        accessibilityIgnoresInvertColors
        source={icon}
        style={{ width: iconSize, height: iconSize }}
        resizeMode="contain"
      />
      <View style={{ flex: 1, gap: s(6) }}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(35),
            lineHeight: s(48),
            letterSpacing: s(-1.5),
            color: "#000000",
            textTransform: "capitalize",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(20),
            lineHeight: s(25),
            letterSpacing: s(-1.5),
            color: "#919191",
            textTransform: "capitalize",
          }}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: s(45.5),
          lineHeight: s(50),
          color: "#000000",
        }}
      >
        ›
      </Text>
    </Pressable>
  );
}
