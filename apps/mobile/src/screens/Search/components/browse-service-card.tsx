import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useCart } from "@/src/stores/cart";
import type { CatalogService } from "@/src/types/service";

/** Figma add button gradient (2228:896 — Group 2890 circular CTA). */
const ADD_BUTTON_GRADIENT = ["#2B768F", "#3A9BBE"] as const;

type Props = {
  service: CatalogService;
  s: (v: number) => number;
  onPressCard: () => void;
  onPressAdd: () => void;
};

export function BrowseServiceCard({ service, s, onPressCard, onPressAdd }: Props) {
  const router = useRouter();
  const cartQty = useCart((state) => state.getQuantity(service.id));
  const inCart = cartQty > 0;

  const cardHeight = s(220);
  const imageWidth = s(203);
  const imageHeight = s(184);
  const addSize = s(87);

  return (
    <Pressable
      onPress={onPressCard}
      accessibilityRole="button"
      accessibilityLabel={`${service.title}. ${service.description}`}
      accessibilityHint="Opens service details"
      style={({ pressed }) => ({
        minHeight: cardHeight,
        borderRadius: s(35),
        backgroundColor: "#fffcf3",
        borderWidth: 1,
        borderColor: "#f4c442",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: s(18),
        paddingLeft: s(19),
        paddingRight: s(16),
        gap: s(16),
        opacity: pressed ? 0.92 : 1,
        borderCurve: "continuous",
        boxShadow: "3px 4px 15px rgba(0,0,0,0.04)",
      })}
    >
      <View
        style={{
          width: imageWidth,
          height: imageHeight,
          borderRadius: s(24),
          overflow: "hidden",
          borderCurve: "continuous",
        }}
      >
        <Image
          source={{ uri: service.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          accessibilityIgnoresInvertColors
          transition={200}
        />
      </View>

      <View style={{ flex: 1, paddingRight: s(8), justifyContent: "center" }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(45),
            // lineHeight: s(42),
            color: "#1e1e1e",
            letterSpacing: -s(1.5),
            textTransform: "capitalize",
          }}
        >
          {service.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(28),
            lineHeight: s(25),
            color: "#9f9f9f",
            letterSpacing: -s(1.5),
            textTransform: "capitalize",
          }}
        >
          {service.description}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (inCart) {
            router.push("/(tabs)/cart-tab");
            return;
          }
          onPressAdd();
        }}
        disabled={!service.isAvailable}
        accessibilityRole="button"
        accessibilityLabel={
          inCart
            ? `${service.title} added to cart. Open cart`
            : `Add ${service.title} to cart`
        }
        accessibilityHint={inCart ? "Opens your cart" : undefined}
        accessibilityState={{ disabled: !service.isAvailable }}
        hitSlop={12}
        style={({ pressed }) => ({
          width: addSize,
          height: addSize,
          borderRadius: addSize / 2,
          overflow: "hidden",
          opacity: pressed ? 0.88 : 1,
          /** Figma vertical offset (Browse card — plus / CTA group). */
          top: s(40),
          alignSelf: "center",
          boxShadow: service.isAvailable
            ? "4px 4px 12px rgba(43,118,143,0.28)"
            : undefined,
        })}
      >
        {service.isAvailable ? (
          <LinearGradient
            colors={[...ADD_BUTTON_GRADIENT]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={{
              width: "100%",
              height: "100%",
              flexDirection: inCart ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: inCart ? s(2) : 0,
              paddingVertical: inCart ? s(4) : 0,
            }}
          >
            {inCart ? (
              <>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.65}
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(20),
                    lineHeight: s(22),
                    color: "#ffffff",
                    letterSpacing: -s(0.5),
                    textAlign: "center",
                    maxWidth: addSize - s(8),
                  }}
                >
                  Added
                </Text>
                <Ionicons name="checkmark" size={s(22)} color="#ffffff" />
              </>
            ) : (
              <Ionicons name="add" size={s(48)} color="#ffffff" />
            )}
          </LinearGradient>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#9c9c9c",
            }}
          >
            <Ionicons name="add" size={s(48)} color="#ffffff" />
          </View>
        )}
      </Pressable>
    </Pressable>
  );
}
