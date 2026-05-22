import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image as RNImage,
  type ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  HOME_SERVICE_CARD_LAYOUT,
  getHomeServiceCardHeight,
  getServiceCardTheme,
} from "@/src/lib/service-card-theme";
import type { CatalogService } from "@/src/types/service";

export type HomeServiceCardModel = {
  id: string;
  title: string;
  desc: string;
  image: ImageSourcePropType;
  themeIndex: number;
};

export function catalogToHomeServiceCard(
  service: CatalogService,
  themeIndex: number,
): HomeServiceCardModel {
  return {
    id: service.id,
    title: service.title,
    desc: service.description,
    image: { uri: service.imageUrl },
    themeIndex,
  };
}

type Props = {
  svc: HomeServiceCardModel;
  s: (v: number) => number;
  onPress?: () => void;
};

export function HomeServiceCard({ svc, s, onPress }: Props) {
  const theme = getServiceCardTheme(svc.themeIndex);
  const L = HOME_SERVICE_CARD_LAYOUT;
  const cardHeight = getHomeServiceCardHeight(s);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={svc.title}
      onPress={onPress}
      style={{
        width: s(L.width),
        height: cardHeight,
        backgroundColor: theme.bg,
        borderRadius: s(L.borderRadius),
        borderWidth: 1,
        borderColor: theme.border,
        overflow: "hidden",
        borderCurve: "continuous",
      }}
    >
      <View style={{ padding: s(L.imageInset) }}>
        <View
          style={{
            height: s(L.imageHeight),
            borderRadius: s(L.imageRadius),
            overflow: "hidden",
            borderCurve: "continuous",
          }}
        >
          {typeof svc.image === "object" &&
          svc.image !== null &&
          "uri" in svc.image ? (
            <Image
              source={svc.image}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <RNImage
              source={svc.image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: s(L.imageInset),
          paddingTop: s(L.bodyPaddingTop),
          paddingBottom: s(L.bodyPaddingBottom),
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            numberOfLines={L.titleLines}
            style={{
              minWidth: 0,
              fontFamily: "Poppins_500Medium",
              fontSize: s(L.titleFontSize),
              lineHeight: s(L.titleLineHeight),
              color: "#262626",
              textTransform: "capitalize",
              letterSpacing: -s(1.5),
            }}
          >
            {svc.title}
          </Text>
          <Text
            numberOfLines={L.descLines}
            style={{
              minWidth: 0,
              fontFamily: "Poppins_400Regular",
              fontSize: s(L.descFontSize),
              lineHeight: s(L.descLineHeight),
              color: "#999",
              alignSelf: "stretch",
              textTransform: "capitalize",
              letterSpacing: -s(1.5),
            }}
          >
            {svc.desc}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-end", marginTop: s(L.arrowMarginTop) }}>
          <View
            style={{
              width: s(L.arrowSize),
              height: s(L.arrowSize),
              borderRadius: s(L.arrowSize / 2),
              overflow: "hidden",
              boxShadow: "5px 5px 15px rgba(0,0,0,0.14)",
            }}
          >
            <LinearGradient
              colors={[theme.gradient.from, theme.gradient.to]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="arrow-up"
                size={s(L.arrowIconSize)}
                color="#fff"
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </LinearGradient>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
