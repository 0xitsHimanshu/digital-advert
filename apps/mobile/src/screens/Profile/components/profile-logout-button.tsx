import { Image, Pressable, Text, View } from "react-native";

const logoutIcon = require("@/assets/images/profile/logout.png");

/** Figma 2245:528–531 — bordered pill, centered “Log Out” label + logout artwork. */
type ProfileLogoutButtonProps = {
  onPress: () => void;
  s: (v: number) => number;
};

export function ProfileLogoutButton({ onPress, s }: ProfileLogoutButtonProps) {
  const iconSize = s(36);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log out"
      onPress={onPress}
      style={({ pressed }) => ({
        alignSelf: "stretch",
        marginTop: s(59),
        height: s(104),
        borderRadius: s(35),
        borderWidth: 1,
        borderColor: "#165d75",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.9 : 1,
        borderCurve: "continuous",
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: s(16),
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(35),
            lineHeight: s(59.896),
            letterSpacing: s(-1.4974),
            color: "#000000",
          }}
        >
          <Text style={{ textTransform: "uppercase" }}>L</Text>
          <Text>og </Text>
          <Text style={{ textTransform: "uppercase" }}>O</Text>
          <Text>ut</Text>
        </Text>
        <Image
          accessibilityIgnoresInvertColors
          source={logoutIcon}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}
