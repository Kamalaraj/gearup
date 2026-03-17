import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/common/page-shell";
import { ProductForm } from "@/components/forms/product-form";
import { customerCookieName, routes } from "@/constants/routes";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (!customerId) {
    redirect(routes.home);
  }

  return (
    <PageShell
      title="Create a new catalog item"
      description="Add a new GearUp product with pricing, stock, category, and display image."
    >
      <ProductForm mode="create" />
    </PageShell>
  );
}
