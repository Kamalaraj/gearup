import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PaginationControls } from "@/components/common/pagination-controls";
import { PageShell } from "@/components/common/page-shell";
import { EmptyState } from "@/components/common/empty-state";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { customerCookieName, routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { productQuerySchema } from "@/schemas/product.schema";
import { productService } from "@/services/product.service";
import Link from "next/link";

export default async function ProductsPage({
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
  const query = productQuerySchema.parse(resolvedSearchParams);
  const result = await productService.listProducts(query);

  return (
    <PageShell
      title="Browse the GearUp catalog"
      description="Search products, filter by category or price, and add the right quantity directly to your active cart."
      showCartLink
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href={routes.productNew}>New product</Link>
          </Button>
        </div>
        <ProductFilters categories={result.categories} defaults={query} />
        {result.data.length ? (
          <>
            <ProductGrid products={JSON.parse(JSON.stringify(result.data))} customerId={customerId} />
            <PaginationControls
              page={result.page}
              totalPages={result.totalPages}
              pathname={routes.products}
              query={query}
            />
          </>
        ) : (
          <EmptyState title="No products found" description="Adjust the filters or try another search term." />
        )}
      </div>
    </PageShell>
  );
}
