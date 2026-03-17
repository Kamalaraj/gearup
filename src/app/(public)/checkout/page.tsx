import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/common/page-shell";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import { Button } from "@/components/ui/button";
import { customerCookieName, routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { cartService } from "@/services/cart.service";
import { customerService } from "@/services/customer.service";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ cartId?: string }>;
}) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (!customerId) {
    redirect(routes.home);
  }

  await connectToDatabase();
  const [customer, cart] = await Promise.all([
    customerService.getCustomerById(customerId),
    cartService.getActiveCart(customerId)
  ]);
  const resolvedSearchParams = await searchParams;

  const activeItems = cart?.items.filter((item) => !item.isDeleted) ?? [];

  if (
    !customer ||
    !cart ||
    !activeItems.length ||
    (resolvedSearchParams.cartId && resolvedSearchParams.cartId !== cart._id.toString())
  ) {
    return (
      <PageShell
        title="Checkout"
        description="Your cart needs at least one active item before an order can be placed."
      >
        <EmptyState
          title="No active cart ready for checkout"
          description="Go back to products, add a few items, and return here."
          action={
            <Button asChild>
              <Link href={routes.products}>Browse products</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Delivery checkout"
      description="Enter delivery details, review the final totals, and place the order."
    >
      <CheckoutForm
        customerId={customerId}
        customerEmail={customer.email}
        cartId={cart._id.toString()}
        cartSummary={
          <OrderSummaryCard
            items={activeItems}
            subtotal={cart.totalAmount}
            deliveryFee={25}
            totalAmount={cart.totalAmount + 25}
          />
        }
      />
    </PageShell>
  );
}
