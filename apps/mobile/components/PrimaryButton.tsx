import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radii } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
}: Props) {
  const isPrimary = variant === "primary";
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        inactive && (isPrimary ? styles.primaryDisabled : styles.secondaryDisabled),
        pressed && !inactive && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#FFFFFF" : colors.primary} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary ? styles.labelPrimary : styles.labelSecondary,
            inactive && (isPrimary ? styles.labelPrimaryDisabled : styles.labelSecondaryDisabled),
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryDisabled: {
    backgroundColor: "#93B4FF",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryPressed: {
    backgroundColor: "#F1F5F9",
  },
  secondaryDisabled: {
    borderColor: "#E2E8F0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelPrimary: {
    color: "#FFFFFF",
  },
  labelPrimaryDisabled: {
    color: "rgba(255,255,255,0.85)",
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelSecondaryDisabled: {
    color: colors.textMuted,
  },
});
