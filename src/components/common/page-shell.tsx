import { cookies } from "next/headers";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";

import { LogoutButton } from "@/components/common/logout-button";
import { customerCookieName, routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export async function PageShell({
  title,
  description,
  children,
  showCartLink = false
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  showCartLink?: boolean;
}) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 rounded-[2rem] border bg-white/85 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <Link href={routes.home} className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
              GearUp
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href={routes.products}>
                <Package className="h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.orders}>Orders</Link>
            </Button>
            {showCartLink ? (
              <Button asChild variant="secondary">
                <Link href={routes.cart}>
                  <ShoppingCart className="h-4 w-4" />
                  View cart
                </Link>
              </Button>
            ) : (
              <Button asChild variant="secondary">
                <Link href={routes.cart}>
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Link>
              </Button>
            )}
            {customerId ? <LogoutButton /> : null}
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
