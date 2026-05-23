import { Text, View } from "react-native";

import { formatCartMoney } from "@/src/lib/cart-totals";
import type { CustomerOrder } from "@/src/types/order";

type OrderSummaryPriceBreakdownProps = {
  order: CustomerOrder;
  s: (v: number) => number;
};

function BreakdownRow({
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
  const font = bold ? "Poppins_600SemiBold" : "Poppins_500Medium";
  const size = bold ? s(38) : s(32);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: s(12),
      }}
    >
      <Text
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: s(48),
          color: "#1e1e1e",
          letterSpacing: s(-1.2),
          textTransform: "capitalize",
          flex: 1,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: s(48),
          color: "#1e1e1e",
          letterSpacing: s(-1.2),
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function OrderSummaryPriceBreakdown({ order, s }: OrderSummaryPriceBreakdownProps) {
  const { currency } = order;
  const serviceCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const serviceLabel = serviceCount === 1 ? "1 service" : `${serviceCount} services`;
  const paymentLabel = order.paymentMethod
    ? `Paid by ${order.paymentMethod}`
    : "Paid online";

  return (
    <View
      style={{
        borderRadius: s(30),
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#165d75",
        paddingHorizontal: s(32),
        paddingTop: s(28),
        paddingBottom: s(28),
        gap: s(14),
        borderCurve: "continuous",
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: s(34),
          lineHeight: s(44),
          color: "#1e1e1e",
          textTransform: "capitalize",
        }}
      >
        Total Order Price
      </Text>

      <BreakdownRow label="Products" value={serviceLabel} s={s} />
      <BreakdownRow
        label="Subtotal"
        value={formatCartMoney(order.subtotalCents, currency)}
        s={s}
      />
      {order.discountCents > 0 ? (
        <BreakdownRow
          label="Discount"
          value={`-${formatCartMoney(order.discountCents, currency)}`}
          s={s}
        />
      ) : null}
      <BreakdownRow label="Tax" value={formatCartMoney(order.taxCents, currency)} s={s} />

      <View
        style={{
          height: 1,
          backgroundColor: "#e0e0e0",
          marginVertical: s(6),
        }}
      />

      <BreakdownRow
        label="Total"
        value={formatCartMoney(order.amountCents, currency)}
        s={s}
        bold
      />

      <View
        style={{
          backgroundColor: "#f4f4f4",
          borderRadius: s(10),
          paddingVertical: s(14),
          paddingHorizontal: s(20),
          alignSelf: "flex-start",
          marginTop: s(4),
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(24),
            color: "#404040",
            textTransform: "capitalize",
          }}
        >
          {paymentLabel}
        </Text>
      </View>
    </View>
  );
}
