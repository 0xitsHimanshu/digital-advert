import MaskedView from "@react-native-masked-view/masked-view";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Platform, Pressable, View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from "react-native-svg";

type TabKey = "home" | "search" | "cart" | "profile";

type BottomNavbarProps = {
  activeTab: TabKey;
  s: (v: number) => number;
  navBottom: number;
};

/**
 * Figma pill: 811×134px @ 90 corner radius (same scale as `s`).
 * Blur + SVG use these pixels so rims stay aligned. Cap width at design width and center.
 * Vector uses 823×146 artboard so stroke / right teal gradient are not clipped.
 */
export const NAV_PILL_DESIGN = { w: 811, h: 134, r: 90, artboardW: 823, artboardH: 146 } as const;

export function getBottomNavbarPillMetrics(
  windowWidth: number,
  s: (v: number) => number,
): { barW: number; barH: number; pillRadius: number; horizontalInset: number } {
  const minGutter = s(120);
  const maxDesignW = s(NAV_PILL_DESIGN.w);
  const barW = Math.max(0, Math.min(maxDesignW, windowWidth - 2 * minGutter));
  const barH = (barW * NAV_PILL_DESIGN.h) / NAV_PILL_DESIGN.w;
  const pillRadius = (barW * NAV_PILL_DESIGN.r) / NAV_PILL_DESIGN.w;
  const horizontalInset = (windowWidth - barW) / 2;
  return { barW, barH, pillRadius, horizontalInset };
}

/** Shell from `assets/images/home/navbar/glass-bg.svg` (823×146); stretches to bar size. */
const GLASS_PATH =
  "M6 73C6 35.9969 35.9969 6.00001 73 6.00001H208.209H310.936C310.936 6.00001 320.668 6.00001 339.051 6.00001C360.997 6.00001 355.229 6.00001 410.377 6.00001C468.769 6.00001 461.749 5.99999 482.868 6.00001C501.251 6.00002 510.983 6.00001 510.983 6.00001H616.953H750C787.003 6.00001 817 35.9969 817 73C817 110.003 787.003 140 750 140H73C35.9969 140 6 110.003 6 73Z";

const GLASS_STROKE_GRADIENT_ID = "glassNavStrokeGrad";

function NavbarGlassSvg({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${NAV_PILL_DESIGN.artboardW} ${NAV_PILL_DESIGN.artboardH}`}
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, top: 0, width, height }}
      pointerEvents="none"
    >
      <Defs>
        <SvgLinearGradient
          id={GLASS_STROKE_GRADIENT_ID}
          x1={-33}
          y1={45}
          x2={1211}
          y2={158}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#005876" />
        </SvgLinearGradient>
      </Defs>
      <Path d={GLASS_PATH} fill="#EEEEEE" fillOpacity={0.56} />
      <Path
        d={GLASS_PATH}
        stroke={`url(#${GLASS_STROKE_GRADIENT_ID})`}
        strokeWidth={4}
        fill="none"
      />
    </Svg>
  );
}

function HomeIconFilled({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 69.12 68.527" fill="none">
      <Path
        d="M59.9903 22.871L41.1262 7.90926C37.4398 4.99687 31.6798 4.96831 28.0222 7.88071L9.15825 22.871C6.45105 25.0124 4.80945 29.2954 5.38545 32.6646L9.01425 54.1935C9.84945 59.0189 14.371 62.8165 19.2958 62.8165H49.8238C54.691 62.8165 59.299 58.9333 60.1342 54.165L63.763 32.6361C64.2814 29.2954 62.6399 25.0124 59.9903 22.871ZM36.7198 51.3953C36.7198 52.566 35.7406 53.5368 34.5598 53.5368C33.379 53.5368 32.3998 52.566 32.3998 51.3953V42.8295C32.3998 41.6588 33.379 40.688 34.5598 40.688C35.7406 40.688 36.7198 41.6588 36.7198 42.8295V51.3953Z"
        fill={color}
      />
    </Svg>
  );
}

function HomeIconOutline({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 70 69" fill="none">
      <Path
        d="M28.648 8.663c3.185-2.536 8.207-2.597 11.543-.208l.318.24 18.855 14.953v.001c1.16.938 2.143 2.385 2.77 4.015.59 1.528.838 3.142.68 4.542l-.037.277-3.625 21.51c-.751 4.29-4.944 7.823-9.325 7.823H19.3c-4.441 0-8.544-3.45-9.296-7.793h-.001L6.374 32.5v-.003l-.042-.279c-.18-1.408.057-3.024.645-4.55.626-1.628 1.618-3.074 2.804-4.012h.002zm5.915 31.025c-1.725 0-3.16 1.41-3.16 3.142v8.565c0 1.731 1.435 3.142 3.16 3.142 1.724 0 3.16-1.41 3.16-3.142V42.83c0-1.731-1.436-3.142-3.16-3.142Z"
        stroke={color}
        strokeWidth={5}
      />
    </Svg>
  );
}

function SearchIconOutline({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 59 59" fill="none">
      <Path
        d="M51.625 28.271c0 12.897-10.457 23.354-23.354 23.354S4.917 41.168 4.917 28.271 15.374 4.917 28.271 4.917s23.354 10.457 23.354 23.354Z"
        stroke={color}
        strokeWidth={5}
      />
      <Path
        d="m45.48 45.48 8.603 8.603"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SearchIconFilled({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 59 59" fill="none">
      <Path
        d="M51.625 28.271c0 12.897-10.457 23.354-23.354 23.354S4.917 41.168 4.917 28.271 15.374 4.917 28.271 4.917s23.354 10.457 23.354 23.354Z"
        fill={color}
        stroke={color}
        strokeWidth={5}
      />
      <Path
        d="m45.48 45.48 8.603 8.603"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Android: BlurView ignores rounded clips; iOS: MaskedView + rounded clip reads as double rims / white bounds. */
function PillBlurBackdrop({
  barW,
  barH,
  pillRadius,
}: {
  barW: number;
  barH: number;
  pillRadius: number;
}) {
  const blur = (
    <BlurView
      intensity={Platform.OS === "ios" ? 26 : 32}
      tint="light"
      style={{ width: barW, height: barH }}
    />
  );

  if (Platform.OS === "android") {
    return (
      <MaskedView
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: barW,
          height: barH,
        }}
        maskElement={
          <View
            style={{
              width: barW,
              height: barH,
              borderRadius: pillRadius,
              backgroundColor: "#000",
            }}
          />
        }
      >
        {blur}
      </MaskedView>
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: barW,
        height: barH,
        borderRadius: pillRadius,
        overflow: "hidden",
      }}
    >
      {blur}
    </View>
  );
}

export function BottomNavbar({
  activeTab,
  s,
  navBottom,
}: BottomNavbarProps) {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const iconColor = "#165D75";
  const { barW, barH, pillRadius, horizontalInset } = getBottomNavbarPillMetrics(
    windowWidth,
    s,
  );

  return (
    <>
      <LinearGradient
        colors={[
          "rgba(255,253,248,0)",
          "rgba(255,253,248,0.6)",
          "rgba(255,253,248,0.92)",
          "#fffdf8",
        ]}
        locations={[0, 0.35, 0.65, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: navBottom + barH + s(100),
        }}
        pointerEvents="none"
      />

      <View
        style={{
          position: "absolute",
          bottom: navBottom,
          left: horizontalInset,
          width: barW,
        }}
      >
        {/*
          iOS: subtle native shadow on rounded wrapper (matches design lift).
          Android: no elevation — Material elevation draws a strong dark rim not in the Figma bar.
          Web: light CSS shadow.
        */}
        <View
          style={[
            {
              borderRadius: pillRadius,
              backgroundColor: "transparent",
            },
            Platform.OS === "ios"
              ? {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 14,
                  borderCurve: "continuous" as const,
                }
              : Platform.OS === "android"
                ? {}
                : {
                    boxShadow: "0px -4px 20px rgba(0,0,0,0.05)",
                  },
          ]}
        >
          <View
            style={{
              height: barH,
              borderRadius: pillRadius,
              overflow: "hidden",
              ...(Platform.OS === "ios" ? { borderCurve: "continuous" as const } : null),
            }}
          >
            <PillBlurBackdrop barW={barW} barH={barH} pillRadius={pillRadius} />
            <NavbarGlassSvg width={barW} height={barH} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                height: barH,
                paddingHorizontal: s(24),
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Home"
                hitSlop={8}
                onPress={() => router.push("/(tabs)/home-tab")}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {activeTab === "home" ? (
                  <HomeIconFilled size={s(64)} color={iconColor} />
                ) : (
                  <HomeIconOutline size={s(64)} color={iconColor} />
                )}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search"
                hitSlop={8}
                onPress={() => router.push("/(tabs)/search-tab")}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {activeTab === "search" ? (
                  <SearchIconFilled size={s(55)} color={iconColor} />
                ) : (
                  <SearchIconOutline size={s(55)} color={iconColor} />
                )}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cart"
                hitSlop={8}
                onPress={() => router.push("/(tabs)/cart-tab")}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons
                  name={activeTab === "cart" ? "cart" : "cart-outline"}
                  size={s(64)}
                  color={iconColor}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Profile"
                hitSlop={8}
                onPress={() => router.push("/(tabs)/profile-tab")}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons
                  name={activeTab === "profile" ? "person" : "person-outline"}
                  size={s(55)}
                  color={iconColor}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
