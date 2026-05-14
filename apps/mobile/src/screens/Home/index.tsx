import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { BottomNavbar, getBottomNavbarPillMetrics } from "@/src/components/bottom-navbar";

const DESIGN_W = 1080;

/** Figma `CTA_Card_background` (2286:290) — artboard x/y used to place children in card space */
const CTA_CARD_X = 52;
const CTA_CARD_Y = 436.66259765625;
const CTA_CARD_H = 463.33740234375;

/** Caps CTA body copy (~13–14 short words) so long CMS strings cannot push the Get Started CTA. */
const CTA_DESCRIPTION_MAX_CHARS = 113;

function truncateCtaDescription(text: string, maxChars = CTA_DESCRIPTION_MAX_CHARS): string {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  const slice = t.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const end =
    lastSpace > maxChars * 0.55 ? slice.slice(0, lastSpace).trimEnd() : slice.trimEnd();
  return `${end}…`;
}

const swirlArrow = require("@/assets/images/home/swirl-arrow-colored.png");

const service1 = require("@/assets/images/home/service-1.png");
const service2 = require("@/assets/images/home/service-2.png");
const service3 = require("@/assets/images/home/service-3.png");
// Arrow circle colors for service cards (rendered via LinearGradient)
const ARROW_GRADIENTS = {
  orange: { from: "#FFDFA9", to: "#EA9400" },
  blue: { from: "#C8DEFF", to: "#064BB3" },
  purple: { from: "#F0C8FF", to: "#F67CFF" },
} as const;

const CTA_PLACEHOLDER_DESCRIPTION =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi mollitia commodi neque dolore ea similique, modi odio assumenda enim quas, ab a laboriosam facere? Eum tenetur illo maxime nisi tempore!";

const catThumb1 = require("@/assets/images/home/category-thumb-1.png");
const catThumb2 = require("@/assets/images/home/category-thumb-2.png");

// Decorative background ellipses are rendered via react-native-svg

type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  image: ImageSourcePropType;
  arrowGradient: keyof typeof ARROW_GRADIENTS;
  bg: string;
  border: string;
};

const SERVICES: ServiceItem[] = [
  {
    id: "ve",
    title: "video editing",
    desc: "popular We sent a verification 5 digit code on your number.",
    image: service1,
    arrowGradient: "orange",
    bg: "#fffaef",
    border: "#ea9400",
  },
  {
    id: "dm",
    title: "digital marketing",
    desc: "popular We sent a verification 5 digit code on your number.",
    image: service2,
    arrowGradient: "blue",
    bg: "#f5f9ff",
    border: "#064bb3",
  },
  {
    id: "dm2",
    title: "digital marketing",
    desc: "popular We sent a verification 5 digit code on your number.",
    image: service3,
    arrowGradient: "purple",
    bg: "#fffaff",
    border: "#f67cff",
  },
];

type CategoryItem = {
  id: string;
  title: string;
  desc: string;
  thumb: ImageSourcePropType;
};

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "c1",
    title: "digital marketing",
    desc: "popular We sent a verification 5 digit code on your number.",
    thumb: catThumb1,
  },
  {
    id: "c2",
    title: "digital marketing",
    desc: "popular We sent a verification 5 digit code on your number.",
    thumb: catThumb2,
  },
];

const PILLS = ["All", "Video Editing", "Marketing", "Design"] as const;

function ServiceCard({
  svc,
  s,
}: {
  svc: ServiceItem;
  s: (v: number) => number;
}) {
  const imageInset = s(19);
  const imageRadius = s(32);
  const imageHeight = s(250);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={svc.title}
      style={{
        width: s(408),
        backgroundColor: svc.bg,
        borderRadius: s(46),
        borderWidth: 1,
        borderColor: svc.border,
        overflow: "hidden",
        borderCurve: "continuous",
      }}
    >
      <View style={{ padding: imageInset }}>
        <View
          style={{
            height: imageHeight,
            borderRadius: imageRadius,
            overflow: "hidden",
            borderCurve: "continuous",
          }}
        >
          <Image
            source={svc.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: imageInset,
          paddingTop: s(4),
          paddingBottom: s(18),
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(38),
            lineHeight: s(55),
            color: "#262626",
            textTransform: "capitalize",
            letterSpacing: -s(1.5),
          }}
        >
          {svc.title}
        </Text>
        <Text
          numberOfLines={3}
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(24),
            lineHeight: s(23),
            color: "#999",
            alignSelf: "stretch",
            textTransform: "capitalize",
            letterSpacing: -s(1.5),
          }}
        >
          {svc.desc}
        </Text>
        <View style={{ alignSelf: "flex-end", marginTop: s(4) }}>
          <View
            style={{
              width: s(80),
              height: s(80),
              borderRadius: s(40),
              overflow: "hidden",
              boxShadow: "5px 5px 15px rgba(0,0,0,0.14)",
            }}
          >
            <LinearGradient
              colors={[
                ARROW_GRADIENTS[svc.arrowGradient].from,
                ARROW_GRADIENTS[svc.arrowGradient].to,
              ]}
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
                size={s(32)}
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

function CategoryCard({
  cat,
  s,
}: {
  cat: CategoryItem;
  s: (v: number) => number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={cat.title}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: s(18),
        backgroundColor: "#fffcf3",
        borderRadius: s(32),
        borderWidth: 1,
        borderColor: "#f4c442",
        gap: s(16),
        borderCurve: "continuous",
      }}
    >
      <View
        style={{
          width: s(110),
          height: s(104),
          borderRadius: s(22),
          borderCurve: "continuous",
          overflow: "hidden",
        }}
      >
        <Image
          source={cat.thumb}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={{ flex: 1, gap: s(4) }}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(32),
            lineHeight: s(55),
            color: "#1e1e1e",
            textTransform: "capitalize",
            letterSpacing: -s(1.5),
          }}
        >
          {cat.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: s(18.5),
            lineHeight: s(23),
            color: "#9f9f9f",
            letterSpacing: -s(1.5),
            textTransform: "capitalize",
          }}
        >
          {cat.desc}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;

  const padH = s(52);
  const { barH: navbarH } = getBottomNavbarPillMetrics(width, s);
  const navBottom = Math.max(insets.bottom, s(20));

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      {/* Background decorative ellipses — SVG rings matching Figma deco layers */}
      {[
        { top: -s(100), right: -s(120), opacity: 0.6 },
        { top: s(500), right: -s(200), opacity: 0.5 },
        { bottom: s(100), left: -s(250), opacity: 0.5 },
      ].map((pos, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: "absolute",
            width: s(632),
            height: s(332),
            transform: [{ rotate: "-8.28deg" }],
            ...pos,
          }}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 632 332"
            fill="none"
          >
            <Path
              d="M293.6 97.8C374.3 71.1 449.9 54.6 506.9 49.5C535.3 46.9 559.1 47.2 576.5 50.5C594 53.9 604.7 60.1 607.7 69.1C610.7 78.1 605.8 89.5 593.8 102.6C581.8 115.6 562.9 130.1 538.6 145.1C489.9 175 419.4 207 338.7 233.7C258 260.5 182.4 277 125.4 282.1C96.9 284.7 73.1 284.3 55.7 281C38.2 277.7 27.5 271.5 24.6 262.5C21.6 253.5 26.4 242.1 38.5 229C50.5 215.9 69.3 201.5 93.7 186.5C142.4 156.5 212.9 124.6 293.6 97.8Z"
              stroke="#2066AC"
              strokeOpacity={0.15}
              strokeWidth={1.82}
            />
            <Path
              d="M303.8 95.3C387.5 80.8 464.8 75.7 521.8 79.2C550.4 80.9 573.9 84.8 590.6 90.6C607.4 96.5 617 104.3 618.6 113.6C620.2 122.9 613.8 133.5 599.9 144.7C586.1 155.8 565.3 167.3 539 178.5C486.3 200.8 411.9 221.9 328.1 236.4C244.3 250.8 167.1 255.9 110 252.5C81.5 250.8 58 246.9 41.3 241.1C24.5 235.2 14.8 227.4 13.2 218.1C11.6 208.8 18.1 198.2 32 187C45.8 175.9 66.6 164.4 92.9 153.2C145.5 130.9 220 109.8 303.8 95.3Z"
              stroke="#2066AC"
              strokeOpacity={0.15}
              strokeWidth={1.82}
            />
          </Svg>
        </View>
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: navbarH + navBottom + s(60),
        }}
      >
        <View style={{ height: insets.top + s(16) }} />

        {/* ——— Greeting ——— */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: padH,
            marginTop: s(16),
          }}
        >

          {/* Greeting hard coded name, TODO: Add dynamic name from user session*/ }
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(55),
              color: "#1e1e1e",
              letterSpacing: -s(1.3),
              textTransform: "capitalize",
            }}
          >
            hey! rahul
          </Text>

          {/* Notification and Menu buttons */}
          {/* TODO: Add dynamic notification count from user session */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: s(14),
            }}
          >
            <View
              style={{
                width: s(100),
                height: s(100),
                borderRadius: s(50),
                backgroundColor: "#fff8e5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications" size={s(55)} color="#1e1e1e" />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Menu"
              hitSlop={12}
              style={{
                width: s(52),
                height: s(56),
                justifyContent: "center",
                alignItems: "flex-end",
                gap: s(8),
              }}
            >
              <View
                style={{
                  width: s(37),
                  height: s(3.5),
                  backgroundColor: "#1e1e1e",
                  borderRadius: s(2),
                }}
              />
              <View
                style={{
                  width: s(26),
                  height: s(3.5),
                  backgroundColor: "#1e1e1e",
                  borderRadius: s(2),
                }}
              />
              <View
                style={{
                  width: s(14),
                  height: s(3.5),
                  backgroundColor: "#1e1e1e",
                  borderRadius: s(2),
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* ——— Best Seller heading ——— */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: padH,
            marginTop: s(10),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: s(100),
              color: "#2f2f2f",
              textTransform: "capitalize",
            }}
          >
            best seller
          </Text>
          <Image
            source={swirlArrow}
            style={{ width: s(150), height: s(166), transform: [{ rotate: "-46.97deg" }] }}
            resizeMode="cover"
          />
        </View>

        {/* ——— CTA Card ——— */}
        <View
          style={{
            marginHorizontal: padH,
            marginTop: s(40),
            borderRadius: s(46),
            overflow: "hidden",
            height: s(CTA_CARD_H),
            borderCurve: "continuous",
            backgroundColor: "#165d75",
          }}
        >
          {/* Outer Circle of the CTA Card */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: s(139.330078125 - CTA_CARD_X),
              top: s(401 - CTA_CARD_Y),
              width: s(941),
              height: s(1221),
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 941 1221" fill="none">
              <Circle
                cx={610.5}
                cy={610.5}
                r={544.04}
                stroke="white"
                strokeOpacity={0.04}
                strokeWidth={132.92}
                fill="none"
              />
            </Svg>
          </View>
          {/* Inner Cirle of the CTA Card */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: s(424 + (726 - 656) / 2 - CTA_CARD_X),
              top: s(641.66259765625 - CTA_CARD_Y),
              width: s(656),
              height: s(725),
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 656 725" fill="none">
              <Path
                d="M363 66.46c163.861 0 296.54 132.628 296.54 296.04S526.861 658.54 363 658.54 66.46 525.912 66.46 362.5 199.139 66.46 363 66.46Z"
                stroke="#fff"
                strokeOpacity={0.04}
                strokeWidth={132.92}
                fill="none"
              />
            </Svg>
          </View>
          {/* CTA dotted frame */}
            <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: s(68.999267578125 - CTA_CARD_X),
              top: s(457.81982421875 - CTA_CARD_Y),
              width: s(942),
              height: s(427),
              borderWidth: s(5),
              borderColor: "rgba(255,255,255,0.5)",
              borderStyle: "dashed",
              borderRadius: s(42),
            }}
            >
            </View>

            {/* CTA Card content */}
          <View
            style={{
              flex: 1,
              paddingLeft: s(100),
              paddingRight: s(40),
              paddingBottom: s(36),
            }}
          >
            <View>
              {/* TODO: Add dynamic title from Database about the CTA Card detials */}
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: s(59),
                  lineHeight: s(66),
                  color: "#fff",
                  width: s(370),
                  textTransform: "capitalize",
                  paddingTop: s(73.34),
                }}
              >
                Boost Your Brand 🚀
              </Text>

              {/* TODO: Add dynamic description from Database about the CTA Card detials */}
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                accessibilityLabel={CTA_PLACEHOLDER_DESCRIPTION}
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: s(28),
                  lineHeight: s(40),
                  color: "#fff",
                  alignSelf: "stretch",
                  marginTop: s(10),
                  marginLeft: s(15),
                  textTransform: "capitalize",
                }}
              >
                {truncateCtaDescription(CTA_PLACEHOLDER_DESCRIPTION)}
              </Text>
            </View>

            {/* Get Started Button */}
            {/* TODO: Add this button working and redirect it to the details of entered best seller service */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get Started"
              style={{
                marginTop: s(20),
                width: s(260),
                height: s(75),
                borderRadius: s(62),
                backgroundColor: "#ffcd47",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "4px 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(34),
                  color: "#212121",
                  letterSpacing: -s(1.1),
                  textTransform: "uppercase",

                }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ——— Top Categories ——— */}
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(42),
            lineHeight: s(56),
            color: "#1e1e1e",
            letterSpacing: -s(1.5),
            paddingHorizontal: padH,
            marginTop: s(40),
            textTransform: "capitalize",
          }}
        >
          top categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padH,
            gap: s(14),
            paddingTop: s(16),
          }}
        >
          {PILLS.map((pill, i) => (
            <Pressable
              key={pill}
              accessibilityRole="button"
              hitSlop={{ top: 6, bottom: 6 }}
              style={{
                height: s(92),
                paddingHorizontal: s(40),
                borderRadius: s(70),
                alignItems: "center",
                justifyContent: "center",
                borderCurve: "continuous",
                ...(i === 0
                  ? {
                      backgroundColor: "#ffcd47",
                      boxShadow: "11px 11px 29px rgba(244,214,66,0.21)",
                      width: s(260),
                    }
                  : {
                      borderWidth: 1,
                      borderColor: "#c6c6c6",
                    }),
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(35),
                  color: i === 0 ? "#000" : "#404040",
                  letterSpacing: -s(1.5),
                  textTransform: "capitalize",
                }}
              >
                {pill}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ——— Popular Services ——— */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: padH,
            marginTop: s(40),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(45),
              lineHeight: s(56),
              width: s(400),
              color: "#1e1e1e",
              letterSpacing: -s(1.5),
              textTransform: "capitalize",
            }}
          >
            popular sevices
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: s(35),
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
            paddingHorizontal: padH,
            gap: s(20),
            paddingTop: s(30),
          }}
        >
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} s={s} />
          ))}
        </ScrollView>

        {/* ——— Categories ——— */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: padH,
            marginTop: s(40),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(45),
              lineHeight: s(56),
              color: "#1e1e1e",
              letterSpacing: -s(1.5),
              textTransform: "capitalize",
            }}
          >
            categories
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: s(35),
                color: "#363636",
                letterSpacing: -s(1.5),
              }}
            >
              See All {">"}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            paddingHorizontal: padH,
            gap: s(16),
            paddingTop: s(16),
          }}
        >
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} s={s} />
          ))}
        </View>
      </ScrollView>


      <BottomNavbar activeTab="home" s={s} navBottom={navBottom} />
    </View>
  );
}
