import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/common/page-shell";
import { ProductForm } from "@/components/forms/product-form";
import { customerCookieName, routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { productIdParamSchema } from "@/schemas/product.schema";
import { productService } from "@/services/product.service";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (!customerId) {
    redirect(routes.home);
  }

  const resolvedParams = await params;
  const parsedParams = productIdParamSchema.safeParse(resolvedParams);

  if (!parsedParams.success) {
    return (
      <PageShell title="Edit product" description="The product identifier is invalid.">
        <EmptyState title="Invalid product id" description="Open a valid product record to edit it." />
      </PageShell>
    );
  }

  await connectToDatabase();
  const product = await productService.getProductById(parsedParams.data.id);

  if (!product) {
    return (
      <PageShell title="Edit product" description="The product could not be found.">
        <EmptyState title="Product not found" description="This catalog item does not exist anymore." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Edit catalog item"
      description="Update the product details and save the changes back to MongoDB."
    >
      <ProductForm mode="edit" product={JSON.parse(JSON.stringify(product))} />
    </PageShell>
  );
}
