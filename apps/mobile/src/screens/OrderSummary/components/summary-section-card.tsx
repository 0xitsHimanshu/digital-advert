import { type ReactNode } from "react";
import { View } from "react-native";

type SummarySectionCardProps = {
  children: ReactNode;
  s: (v: number) => number;
  borderRadius?: number;
  minHeight?: number;
};

export function SummarySectionCard({
  children,
  s,
  borderRadius = 30,
  minHeight,
}: SummarySectionCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: s(borderRadius),
        borderWidth: 1,
        borderColor: "#165d75",
        paddingHorizontal: s(28),
        paddingVertical: s(24),
        gap: s(14),
        minHeight: minHeight ? s(minHeight) : undefined,
        borderCurve: "continuous",
      }}
    >
      {children}
    </View>
  );
}
