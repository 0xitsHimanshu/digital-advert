import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CartCoupon } from "@/src/types/cart-coupon";
import { CART_COUPONS } from "@/src/types/cart-coupon";

type CouponsModalProps = {
  visible: boolean;
  selectedCouponId: string | null;
  adDiscountUnlocked: boolean;
  onClose: () => void;
  onSelectCoupon: (coupon: CartCoupon | null) => void;
  onUnlockAdDiscount: () => void;
  s: (v: number) => number;
};

function CouponCard({
  coupon,
  selected,
  onPress,
  s,
}: {
  coupon: CartCoupon;
  selected: boolean;
  onPress: () => void;
  s: (v: number) => number;
}) {
  const discountLabel =
    coupon.kind === "percent" ? `${coupon.value}% off` : "Flat discount";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Apply coupon ${coupon.code}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        borderRadius: s(28),
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "#166680" : "#e5e5e5",
        backgroundColor: "#fff",
        padding: s(24),
        marginBottom: s(16),
        shadowColor: "#000",
        shadowOffset: { width: s(4), height: s(4) },
        shadowOpacity: 0.06,
        shadowRadius: s(10),
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: s(16) }}>
        <View
          style={{
            width: s(56),
            height: s(56),
            borderRadius: s(14),
            backgroundColor: "#ca8a2f",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="pricetag" size={s(28)} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: s(32),
              color: "#1e1e1e",
              textTransform: "capitalize",
            }}
          >
            {coupon.title}
          </Text>
          <Text
            style={{
              marginTop: s(4),
              fontFamily: "Poppins_400Regular",
              fontSize: s(24),
              color: "#9f9f9f",
            }}
          >
            {coupon.description}
          </Text>
          <Text
            style={{
              marginTop: s(8),
              fontFamily: "Poppins_500Medium",
              fontSize: s(26),
              color: "#166680",
            }}
          >
            {coupon.code} · {discountLabel}
          </Text>
        </View>
        {selected ? (
          <Ionicons name="checkmark-circle" size={s(36)} color="#166680" />
        ) : null}
      </View>
    </Pressable>
  );
}

/** Offers sheet — matches cart visual language (white cards, teal accent, gold voucher). */
export function CouponsModal({
  visible,
  selectedCouponId,
  adDiscountUnlocked,
  onClose,
  onSelectCoupon,
  onUnlockAdDiscount,
  s,
}: CouponsModalProps) {
  const insets = useSafeAreaInsets();

  const handleWatchAd = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onUnlockAdDiscount();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            maxHeight: "88%",
            backgroundColor: "#fffdf8",
            borderTopLeftRadius: s(36),
            borderTopRightRadius: s(36),
            paddingTop: s(20),
            paddingBottom: insets.bottom + s(24),
            paddingHorizontal: s(52),
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: s(80),
              height: s(6),
              borderRadius: s(3),
              backgroundColor: "#d0d0d0",
              marginBottom: s(24),
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: s(24),
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(44),
                color: "#1e1e1e",
                letterSpacing: -s(1.3),
                textTransform: "capitalize",
              }}
            >
              Coupons & offers
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close coupons"
              hitSlop={12}
              onPress={onClose}
            >
              <Ionicons name="close" size={s(36)} color="#9f9f9f" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Watch ad for five percent discount"
              accessibilityState={{ selected: adDiscountUnlocked }}
              onPress={handleWatchAd}
              style={{
                borderRadius: s(28),
                borderWidth: adDiscountUnlocked ? 2 : 1,
                borderColor: adDiscountUnlocked ? "#166680" : "#f4c442",
                backgroundColor: "#fffcf3",
                padding: s(24),
                marginBottom: s(24),
                flexDirection: "row",
                alignItems: "center",
                gap: s(16),
              }}
            >
              <View
                style={{
                  width: s(56),
                  height: s(56),
                  borderRadius: s(14),
                  backgroundColor: "#165d75",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="play-circle" size={s(32)} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(32),
                    color: "#1e1e1e",
                  }}
                >
                  Watch an ad
                </Text>
                <Text
                  style={{
                    marginTop: s(4),
                    fontFamily: "Poppins_400Regular",
                    fontSize: s(24),
                    color: "#9f9f9f",
                  }}
                >
                  Unlock an extra 5% off this order
                </Text>
              </View>
              {adDiscountUnlocked ? (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(24),
                    color: "#166680",
                  }}
                >
                  Applied
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(26),
                    color: "#166680",
                  }}
                >
                  View
                </Text>
              )}
            </Pressable>

            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: s(28),
                color: "#9f9f9f",
                marginBottom: s(16),
                textTransform: "uppercase",
                letterSpacing: -s(1),
              }}
            >
              Available coupons
            </Text>

            {CART_COUPONS.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                selected={selectedCouponId === coupon.id}
                onPress={() =>
                  onSelectCoupon(selectedCouponId === coupon.id ? null : coupon)
                }
                s={s}
              />
            ))}

            {selectedCouponId ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove applied coupon"
                onPress={() => onSelectCoupon(null)}
                style={{ alignItems: "center", paddingVertical: s(16) }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(26),
                    color: "#9f9f9f",
                  }}
                >
                  Remove coupon
                </Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
