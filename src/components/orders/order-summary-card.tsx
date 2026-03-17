import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function OrderSummaryCard({
  items,
  subtotal,
  deliveryFee,
  totalAmount,
  title = "Order summary"
}: {
  items: Array<{ name: string; quantity: number; priceAtTime: number }>;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  title?: string;
}) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Review the totals before you continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.name}-${item.quantity}`} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.priceAtTime * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
