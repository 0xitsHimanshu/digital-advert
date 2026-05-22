import { Text, View } from "react-native";

import { formatCartMoney, type CartTotals } from "@/src/lib/cart-totals";

type OrderSummaryProps = {
  totals: CartTotals;
  s: (v: number) => number;
};

function SummaryRow({
  label,
  value,
  s,
  bold,
}: {
  label: string;
  value: string;
  s: (v: number) => number;
  bold?: boolean;
}) {
  const font = bold ? "Poppins_500Medium" : "Poppins_400Regular";
  const size = bold ? s(40) : s(35);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: s(60),
          color: "#1e1e1e",
          letterSpacing: -s(1.5),
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: s(60),
          color: "#1e1e1e",
          letterSpacing: -s(1.5),
          textTransform: "uppercase",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/** Figma PRICE TOTAL 2243:379–389 — products, subtotal, tax, discount, total. */
export function OrderSummary({ totals, s }: OrderSummaryProps) {
  const { currency, subtotalCents, discountCents, taxCents, totalCents } = totals;

  const serviceLabel =
    totals.serviceCount === 1
      ? "1 service"
      : `${totals.serviceCount} services`;

  return (
    <View
      style={{
        borderRadius: s(28),
        backgroundColor: "#fff",
        paddingHorizontal: s(44),
        paddingTop: s(24),
        paddingBottom: s(28),
        shadowColor: "#000",
        shadowOffset: { width: s(7), height: s(7) },
        shadowOpacity: 0.1,
        shadowRadius: s(14),
        elevation: 4,
        borderCurve: "continuous",
        gap: s(8),
      }}
    >
      <SummaryRow
        label="products"
        value={serviceLabel}
        s={s}
      />
      <SummaryRow
        label="subtotal"
        value={formatCartMoney(subtotalCents, currency)}
        s={s}
      />
      {discountCents > 0 ? (
        <SummaryRow
          label="discount"
          value={`-${formatCartMoney(discountCents, currency)}`}
          s={s}
        />
      ) : null}
      <SummaryRow
        label="tax"
        value={formatCartMoney(taxCents, currency)}
        s={s}
      />
      <View style={{ height: s(8) }} />
      <SummaryRow
        label="total"
        value={formatCartMoney(totalCents, currency)}
        s={s}
        bold
      />
    </View>
  );
}
