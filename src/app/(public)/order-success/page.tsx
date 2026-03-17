import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/common/page-shell";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { orderService } from "@/services/order.service";

export default async function OrderSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.orderId) {
    return (
      <PageShell title="Order complete" description="Your order has been processed.">
        <EmptyState title="No order selected" description="Open this page with an order id to see the full summary." />
      </PageShell>
    );
  }

  await connectToDatabase();
  const order = await orderService.getOrderById(resolvedSearchParams.orderId);

  if (!order) {
    return (
      <PageShell title="Order complete" description="Your order has been processed.">
        <EmptyState title="Order not found" description="The order summary could not be loaded." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Order placed successfully"
      description="GearUp saved your order, deducted stock, and attempted to send a confirmation email."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <Card>
          <CardHeader>
            <Badge variant="accent" className="w-fit">
              Success
            </Badge>
            <CardTitle className="mt-3">Order {order.orderId}</CardTitle>
            <CardDescription>Your order is currently marked as {order.orderStatus}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-muted p-4 text-sm">
              <p className="font-medium">{order.deliveryDetails.recipientName}</p>
              <p>{order.deliveryDetails.phone}</p>
              <p>{order.deliveryDetails.addressLine1}</p>
              {order.deliveryDetails.addressLine2 ? <p>{order.deliveryDetails.addressLine2}</p> : null}
              <p>
                {order.deliveryDetails.city}, {order.deliveryDetails.postalCode}
              </p>
            </div>
            <Button asChild>
              <Link href={routes.products}>Back to products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.orders}>View orders</Link>
            </Button>
          </CardContent>
        </Card>
        <OrderSummaryCard
          title="Confirmed order"
          items={JSON.parse(JSON.stringify(order.items))}
          subtotal={order.subtotal}
          deliveryFee={order.deliveryFee}
          totalAmount={order.totalAmount}
        />
      </div>
    </PageShell>
  );
}
