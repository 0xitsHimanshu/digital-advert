import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomNavbar,
  getBottomNavbarPillMetrics,
} from "@/src/components/bottom-navbar";
import { useServicesCatalog } from "@/src/hooks/use-services-catalog";
import { BrowseServiceCard } from "@/src/screens/Search/components/browse-service-card";
import { ServiceSearchBar } from "@/src/screens/Search/components/service-search-bar";
import { useCart } from "@/src/stores/cart";
import type { CatalogService } from "@/src/types/service";

const DESIGN_W = 1080;
const H_PAD = 52;

export default function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const padH = s(H_PAD);
  const navBottom = Math.max(insets.bottom, s(20));
  const { barH } = getBottomNavbarPillMetrics(width, s);
  const navbarH = barH + navBottom + s(24);

  const [query, setQuery] = useState("");
  const { services, status, error, isSearching, refetch, totalCount } =
    useServicesCatalog(query);
  const addService = useCart((state) => state.addService);

  const openServiceDetail = useCallback(
    (serviceId: string) => {
      router.push({ pathname: "/service/[id]", params: { id: serviceId } });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: CatalogService }) => (
      <BrowseServiceCard
        service={item}
        s={s}
        onPressCard={() => openServiceDetail(item.id)}
        onPressAdd={() => addService(item)}
      />
    ),
    [addService, openServiceDetail, s],
  );

  const listHeader = (
    <View style={{ paddingBottom: s(20), paddingTop: s(60) }}>
      <View style={{ height: insets.top + s(16) }} />
      <Text
        accessibilityRole="header"
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: s(52),
          lineHeight: s(52),
          color: "#1e1e1e",
          letterSpacing: -s(1.29),
          textTransform: "capitalize",
          marginBottom: s(24),
          paddingBottom: s(24),
        }}
      >
        all services
      </Text>
      <ServiceSearchBar value={query} onChangeText={setQuery} s={s} />
    </View>
  );

  const listEmpty = () => {
    if (status === "loading" || status === "idle") {
      return (
        <View style={{ paddingTop: s(80), alignItems: "center" }}>
          <ActivityIndicator size="large" color="#165d75" />
        </View>
      );
    }

    if (status === "error") {
      return (
        <View
          style={{
            paddingHorizontal: padH,
            paddingTop: s(48),
            alignItems: "center",
            gap: s(20),
          }}
        >
          <Ionicons name="cloud-offline-outline" size={s(64)} color="#9f9f9f" />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: s(28),
              lineHeight: s(38),
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            {error ?? "Could not load services."}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading services"
            onPress={() => void refetch()}
            style={{
              paddingHorizontal: s(40),
              paddingVertical: s(16),
              borderRadius: s(40),
              backgroundColor: "#165d75",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(28),
                color: "#fff",
              }}
            >
              Try again
            </Text>
          </Pressable>
        </View>
      );
    }

    if (totalCount === 0) {
      return (
        <View style={{ paddingHorizontal: padH, paddingTop: s(48), alignItems: "center" }}>
          <Ionicons name="albums-outline" size={s(64)} color="#9f9f9f" />
          <Text
            style={{
              marginTop: s(16),
              fontFamily: "Poppins_500Medium",
              fontSize: s(32),
              color: "#1e1e1e",
              textAlign: "center",
            }}
          >
            No services available
          </Text>
          <Text
            style={{
              marginTop: s(8),
              fontFamily: "Poppins_400Regular",
              fontSize: s(24),
              color: "#9f9f9f",
              textAlign: "center",
            }}
          >
            Check back soon — new services may be added by your provider.
          </Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={{ paddingHorizontal: padH, paddingTop: s(48), alignItems: "center" }}>
          <Ionicons name="search-outline" size={s(64)} color="#9f9f9f" />
          <Text
            style={{
              marginTop: s(16),
              fontFamily: "Poppins_500Medium",
              fontSize: s(32),
              color: "#1e1e1e",
              textAlign: "center",
            }}
          >
            No services match your search
          </Text>
          <Text
            style={{
              marginTop: s(8),
              fontFamily: "Poppins_400Regular",
              fontSize: s(24),
              color: "#9f9f9f",
              textAlign: "center",
            }}
          >
            Try a different keyword or clear the search field.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <FlatList
        data={status === "ready" ? services : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        ListHeaderComponent={
          <>
            {listHeader}
            <View style={{ height: s(30) }} />
          </>
        }
        contentContainerStyle={{
          paddingBottom: navbarH + s(40),
          flexGrow: 1,
          paddingHorizontal: padH,
        }}
        ItemSeparatorComponent={() => <View style={{ height: s(30) }} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
      />

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(255,253,248,0)", "rgba(255,253,248,0.85)", "#fffdf8"]}
        locations={[0, 0.45, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: navbarH - s(20),
          height: s(180),
        }}
      />

      <BottomNavbar activeTab="search" s={s} navBottom={navBottom} />
    </View>
  );
}
