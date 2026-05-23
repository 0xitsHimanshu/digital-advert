import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import {
  HomeServiceCard,
  catalogToHomeServiceCard,
} from "@/src/components/home-service-card";
import { formatServicePrice } from "@/src/lib/format-price";
import {
  formatServicesApiError,
  getCatalogService,
  listCatalogServices,
} from "@/src/services/services-api";
import { selectCartItemCount, useCart } from "@/src/stores/cart";
import type { CatalogService } from "@/src/types/service";

const DESIGN_W = 1080;

/** Figma 2228:969 — bottom fade; solid #fffdf8 at 10.305% of 1771px overlay. */
const HERO_IMAGE_FADE_OVERLAY_H = 1771;
const HERO_IMAGE_FADE_STOP_RATIO = 0.10305;
const HERO_IMAGE_FADE_MASK_H =
  HERO_IMAGE_FADE_OVERLAY_H * HERO_IMAGE_FADE_STOP_RATIO;

/** Title y=816 small gap so image ends just above the heading **/
const HERO_TITLE_Y = 816;
const HERO_TITLE_GAP = 20;
const HERO_IMAGE_HEIGHT = HERO_TITLE_Y - HERO_TITLE_GAP;


const swirlArrow = require("@/assets/images/home/swirl-arrow-colored.png");

const TRUST_BADGES = [
  "100% secure payment",
  "24/7 customer support",
  "satisfaction guaranteed",
] as const;

const DESCRIPTION_PREVIEW_CHARS = 220;

function TrustBadgeRow({ s }: { s: (v: number) => number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: s(24),
        rowGap: s(12),
        marginTop: s(32),
      }}
    >
      {TRUST_BADGES.map((label) => (
        <Text
          key={label}
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(28),
            color: "#1e1e1e",
            textTransform: "capitalize",
            letterSpacing: -s(1.5),
          }}
        >
          {label}
        </Text>
      ))}
    </View>
  );
}

function ServiceDescription({
  text,
  s,
}: {
  text: string;
  s: (v: number) => number;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > DESCRIPTION_PREVIEW_CHARS;
  const preview = needsTruncate
    ? `${text.slice(0, DESCRIPTION_PREVIEW_CHARS).trimEnd()}…`
    : text;

  return (
    <Text
      style={{
        marginTop: s(24),
        fontFamily: "Poppins_400Regular",
        fontSize: s(35),
        color: "#9f9f9f",
        letterSpacing: -s(1.5),
      }}
    >
      {expanded || !needsTruncate ? text : preview}{" "}
      {needsTruncate && !expanded ? (
        <Text
          onPress={() => setExpanded(true)}
          accessibilityRole="button"
          accessibilityLabel="Read more description"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(25),
            color: "#303030",
            textTransform: "uppercase",
            letterSpacing: -s(1.5),
          }}
        >
          read more
        </Text>
      ) : null}
    </Text>
  );
}

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceId = typeof id === "string" ? id : "";
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const padH = s(52);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [service, setService] = useState<CatalogService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<CatalogService[]>([]);

  const addService = useCart((state) => state.addService);
  const cartQty = useCart((state) => state.getQuantity(serviceId));
  const cartItemCount = useCart(selectCartItemCount);

  const load = useCallback(async () => {
    if (!serviceId) {
      setStatus("error");
      setError("Service not found.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const [item, catalog] = await Promise.all([
        getCatalogService(serviceId),
        listCatalogServices({ fallbackToMock: true }),
      ]);
      if (!item) {
        setStatus("error");
        setError("Service not found.");
        return;
      }
      setService(item);
      setRecommended(
        catalog.filter((svc) => svc.id !== serviceId && svc.isAvailable).slice(0, 6),
      );
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(formatServicesApiError(e));
    }
  }, [serviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  const recommendedCards = useMemo(
    () =>
      recommended.map((svc, index) =>
        catalogToHomeServiceCard(svc, index),
      ),
    [recommended],
  );

  const buyNowBarHeight = s(146);
  const priceAboveBuyGap = s(12);
  const priceFontSize = s(45);
  const priceLineHeight = s(56);
  const priceRowHeight = priceLineHeight;

  const unitPriceLabel =
    service != null
      ? formatServicePrice(service.priceCents, service.currency)
      : null;

  const scrollBottomPad =
    buyNowBarHeight +
    priceRowHeight +
    priceAboveBuyGap +
    insets.bottom +
    s(24);

  const handleAddToCart = useCallback(() => {
    if (!service?.isAvailable) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addService(service);
  }, [addService, service]);

  const handleBuyNow = useCallback(() => {
    if (!service?.isAvailable) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (cartQty === 0) {
      addService(service);
    }
    router.push("/checkout");
  }, [addService, cartQty, router, service]);

  const handleBuildYourOwn = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Placeholder — custom service builder not implemented yet.
  }, []);

  const openService = useCallback(
    (targetId: string) => {
      router.push({ pathname: "/service/[id]", params: { id: targetId } });
    },
    [router],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      {status === "loading" ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#165d75" />
        </View>
      ) : null}

      {status === "error" ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: padH,
            gap: s(20),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: s(28),
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={{
              paddingHorizontal: s(40),
              paddingVertical: s(16),
              borderRadius: s(40),
              backgroundColor: "#165d75",
            }}
          >
            <Text style={{ fontFamily: "Poppins_500Medium", fontSize: s(28), color: "#fff" }}>
              Go back
            </Text>
          </Pressable>
        </View>
      ) : null}

      {status === "ready" && service ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: scrollBottomPad }}
          >
            {/* Hero image — Figma full-bleed header with fade into #fffdf8 */}
            <View style={{ height: s(HERO_IMAGE_HEIGHT), width: "100%", overflow: "hidden" }}>
              <Image
                source={{ uri: service.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
              />
              <LinearGradient
                colors={["rgba(255,253,248,0)", "#fffdf8"]}
                locations={[0, 1]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: s(HERO_IMAGE_FADE_MASK_H),
                }}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: s(147),
                }}
              />
            </View>

            <View style={{ paddingHorizontal: padH }}>
              {/* Title + decorative squiggle (Figma 2228:1056) */}
              <View
                style={{
                  position: "relative",
                  marginTop: s(HERO_TITLE_GAP),
                  paddingRight: s(40),
                }}
              >
                <Text
                  accessibilityRole="header"
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(55),
                    color: "#000",
                    textTransform: "capitalize",
                    letterSpacing: -s(1.5),
                  }}
                >
                  {service.title}
                </Text>
                <View pointerEvents="none" style={{ position: "absolute", right: s(-80), top: s(8) }}>
                  <RNImage
                    source={swirlArrow}
                    style={{
                      width: s(230),
                      height: s(80),
                      transform: [{ rotate: "107.83deg" }],
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <ServiceDescription text={service.description} s={s} />

              <TrustBadgeRow s={s} />

              {/* Add to cart + Build your own service (Figma 2228:992–994) */}
              <View
                style={{
                  flexDirection: "row",
                  gap: s(16),
                  marginTop: s(48),
                }}
              >
                <Pressable
                  disabled={!service.isAvailable}
                  accessibilityRole="button"
                  accessibilityLabel={
                    cartQty > 0
                      ? `Add another ${service.title} to cart`
                      : `Add ${service.title} to cart`
                  }
                  onPress={handleAddToCart}
                  style={({ pressed }) => ({
                    flex: 461 / (461 + 484),
                    minWidth: 0,
                    height: s(112),
                    borderRadius: s(56),
                    backgroundColor: service.isAvailable ? "#ffcd47" : "#e5e5e5",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: s(12),
                    opacity: pressed ? 0.92 : 1,
                    boxShadow: service.isAvailable
                      ? "4px 4px 15px rgba(0,0,0,0.12)"
                      : undefined,
                  })}
                >
                  <Ionicons name="cart" size={s(40)} color="#fff" />
                  <Text
                    style={{
                      flexShrink: 1,
                      minWidth: 0,
                      fontFamily: "Poppins_500Medium",
                      fontSize: s(35),
                      color: "#fff",
                      letterSpacing: -s(1.26),
                      textTransform: "capitalize",
                    }}
                  >
                    {cartQty > 0 ? `in cart (${cartQty})` : "add to cart"}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Build your own service"
                  accessibilityHint="Coming soon"
                  onPress={handleBuildYourOwn}
                  style={({ pressed }) => ({
                    flex: 484 / (461 + 484),
                    minWidth: 0,
                    height: s(112),
                    borderRadius: s(56),
                    borderWidth: 1,
                    borderColor: "#3f3f3f",
                    backgroundColor: "#fffdf8",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: s(12),
                    opacity: pressed ? 0.92 : 1,
                  })}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      flexShrink: 1,
                      minWidth: 0,
                      fontFamily: "Poppins_500Medium",
                      fontSize: s(35),
                      lineHeight: s(46),
                      color: "#3f3f3f",
                      textAlign: "center",
                      letterSpacing: -s(1.19),
                      textTransform: "capitalize",
                    }}
                  >
                    build your own service
                  </Text>
                </Pressable>
              </View>

              {/* Recommended for you */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: s(56),
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(45),
                    lineHeight: s(56),
                    color: "#1e1e1e",
                    letterSpacing: -s(1.5),
                    textTransform: "capitalize",
                  }}
                >
                  recommended for you
                </Text>
                <Pressable accessibilityRole="button" hitSlop={8}>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: s(25),
                      color: "#363636",
                      letterSpacing: -s(1.5),
                    }}
                  >
                    See All {">"}
                  </Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: s(20),
                  paddingTop: s(30),
                  paddingRight: padH,
                }}
              >
                {recommendedCards.map((card) => (
                  <HomeServiceCard
                    key={card.id}
                    svc={card}
                    s={s}
                    onPress={() => openService(card.id)}
                  />
                ))}
              </ScrollView>

              {/* Bottom decorative swirl (Figma 2228:1019) */}
              <View
                pointerEvents="none"
                style={{
                  marginTop: s(40),
                  height: s(200),
                  overflow: "hidden",
                  opacity: 0.5,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: -s(120),
                    bottom: -s(40),
                    width: s(632),
                    height: s(332),
                    transform: [{ rotate: "-8.28deg" }],
                  }}
                >
                  <Svg width="100%" height="100%" viewBox="0 0 632 332" fill="none">
                    <Path
                      d="M293.6 97.8C374.3 71.1 449.9 54.6 506.9 49.5C535.3 46.9 559.1 47.2 576.5 50.5C594 53.9 604.7 60.1 607.7 69.1C610.7 78.1 605.8 89.5 593.8 102.6C581.8 115.6 562.9 130.1 538.6 145.1C489.9 175 419.4 207 338.7 233.7C258 260.5 182.4 277 125.4 282.1C96.9 284.7 73.1 284.3 55.7 281C38.2 277.7 27.5 271.5 24.6 262.5C21.6 253.5 26.4 242.1 38.5 229C50.5 215.9 69.3 201.5 93.7 186.5C142.4 156.5 212.9 124.6 293.6 97.8Z"
                      stroke="#2066AC"
                      strokeOpacity={0.15}
                      strokeWidth={1.82}
                    />
                  </Svg>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Overlay header: back + cart (Figma 2228:1036–1051) */}
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              top: insets.top + s(24),
              left: padH,
              right: padH,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => router.back()}
              style={{
                width: s(70.5),
                height: s(70.5),
                borderRadius: s(35.25),
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Ionicons name="chevron-back" size={s(36)} color="#1e1e1e" />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                cartItemCount > 0 ? `Cart, ${cartItemCount} items` : "Cart"
              }
              onPress={() => router.push("/(tabs)/cart-tab")}
              style={{
                width: s(70.5),
                height: s(70.5),
                borderRadius: s(35.25),
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Ionicons name="cart-outline" size={s(36)} color="#1e1e1e" />
              {cartItemCount > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: s(4),
                    right: s(2),
                    minWidth: s(20),
                    height: s(20),
                    borderRadius: s(10),
                    backgroundColor: "#e53935",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: s(4),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: s(13),
                      color: "#fff",
                      letterSpacing: -s(0.41),
                    }}
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          {/* Price + fixed Buy Now bar */}
          <View
            style={{
              position: "absolute",
              left: padH,
              right: padH,
              bottom: insets.bottom + s(16),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: priceAboveBuyGap,
                minHeight: priceRowHeight,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: priceFontSize,
                  lineHeight: priceLineHeight,
                  color: "#1e1e1e",
                  letterSpacing: -s(1.5),
                  textTransform: "capitalize",
                }}
              >
                {unitPriceLabel != null ? "price" : "pricing"}
              </Text>
              <Text
                accessibilityRole="text"
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: priceFontSize,
                  lineHeight: priceLineHeight,
                  color: unitPriceLabel != null ? "#165d75" : "#9f9f9f",
                  letterSpacing: -s(1.5),
                }}
              >
                {unitPriceLabel ?? "on request"}
              </Text>
            </View>
            <Pressable
              disabled={!service.isAvailable}
              accessibilityRole="button"
              accessibilityLabel={
                unitPriceLabel
                  ? `Buy now, ${unitPriceLabel}`
                  : "Buy now, price on request"
              }
              onPress={handleBuyNow}
              style={({ pressed }) => ({
                height: buyNowBarHeight,
                borderRadius: s(73),
                backgroundColor: service.isAvailable ? "#165d75" : "#9c9c9c",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: s(32),
                opacity: pressed ? 0.94 : 1,
                boxShadow: "0px 4px 16px rgba(22,93,117,0.35)",
              })}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: s(40),
                  lineHeight: s(49),
                  color: "#fff",
                  letterSpacing: -s(1.26),
                  textTransform: "capitalize",
                }}
              >
                buy now
              </Text>
              <View
                style={{
                  position: "absolute",
                  right: s(24),
                  width: s(67),
                  height: s(67),
                  borderRadius: s(34),
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={s(32)}
                  color="#165d75"
                  style={{ transform: [{ rotate: "-45deg" }] }}
                />
              </View>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}
