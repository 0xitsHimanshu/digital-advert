import { Text } from "react-native";

type ProfileSectionTitleProps = {
  title: string;
  s: (v: number) => number;
};

export function ProfileSectionTitle({ title, s }: ProfileSectionTitleProps) {
  return (
    <Text
      style={{
        fontFamily: "Poppins_500Medium",
        fontSize: s(37),
        lineHeight: s(60),
        letterSpacing: s(-1.5),
        color: "#000000",
        textTransform: "capitalize",
      }}
    >
      {title}
    </Text>
  );
}
