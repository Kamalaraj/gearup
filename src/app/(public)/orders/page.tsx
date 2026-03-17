import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/common/page-shell";
import { PaginationControls } from "@/components/common/pagination-controls";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderListTable } from "@/components/orders/order-list-table";
import { Button } from "@/components/ui/button";
import { customerCookieName, routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { orderListQuerySchema } from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";
import Link from "next/link";

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (!customerId) {
    redirect(routes.home);
  }

  await connectToDatabase();
  const resolvedSearchParams = await searchParams;
  const query = orderListQuerySchema.parse({
    ...resolvedSearchParams,
    customerId
  });
  const result = await orderService.listOrders(query);

  return (
    <PageShell
      title="Your orders"
      description="Browse your GearUp order history with status filters and pagination."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button asChild variant="secondary">
            <Link href={routes.products}>Back to products</Link>
          </Button>
        </div>
        <OrderFilters defaults={query} />
        {result.data.length ? (
          <>
            <OrderListTable orders={JSON.parse(JSON.stringify(result.data))} />
            <PaginationControls
              page={result.page}
              totalPages={result.totalPages}
              pathname={routes.orders}
              query={query}
            />
          </>
        ) : (
          <EmptyState
            title="No orders found"
            description="Place an order first or adjust the current search and status filters."
            action={
              <Button asChild>
                <Link href={routes.products}>Browse products</Link>
              </Button>
            }
          />
        )}
      </div>
    </PageShell>
  );
}
