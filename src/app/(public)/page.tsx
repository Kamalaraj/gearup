import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";

import { PageShell } from "@/components/common/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { customerCookieName, routes } from "@/constants/routes";

export default async function HomePage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(customerCookieName)?.value;

  if (customerId) {
    redirect(routes.products);
  }

  return (
    <PageShell
      title="Welcome to GearUp"
      description="Choose how you want to continue."
    >
      <section>
        <Card className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-10">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">
                Welcome to GearUp
              </p>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
                  Premium gear, cleaner ordering, faster checkout.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Sign in if you already have an account. If you are new to GearUp, create one and start browsing
                  products right away.
                </p>
              </div>
            </div>
            <div className="self-end rounded-[1.75rem] bg-stone-50 p-4 ring-1 ring-stone-200">
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700">Do you already have an account?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    className="h-10 w-full justify-between rounded-full bg-[#f3dcc4] px-4 text-left text-slate-800 shadow-none hover:bg-[#ecd1b3]"
                  >
                    <Link href={routes.login}>
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <LogIn className="h-3.5 w-3.5" />
                        Sign in
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 w-full justify-between rounded-full border-cyan-200 bg-cyan-50 px-4 text-left text-cyan-900 hover:bg-cyan-100"
                  >
                    <Link href={routes.signup}>
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <UserPlus className="h-3.5 w-3.5" />
                        Create account
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
