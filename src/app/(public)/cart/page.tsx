import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/common/page-shell";
import { CartView } from "@/components/cart/cart-view";
import { customerCookieName, routes } from "@/constants/routes";
import { connectToDatabase } from "@/lib/db";
import { cartService } from "@/services/cart.service";

export default async function CartPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (!customerId) {
    redirect(routes.home);
  }

  await connectToDatabase();
  const cart = await cartService.getActiveCart(customerId);

  return (
    <PageShell
      title="Your active cart"
      description="Every cart action is stored against your customer record in MongoDB, including quantity changes and removals."
    >
      <CartView cart={cart ? JSON.parse(JSON.stringify(cart)) : null} />
    </PageShell>
  );
}
