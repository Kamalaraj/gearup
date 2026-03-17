import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import Link from "next/link";

export function OrderFilters({
  defaults
}: {
  defaults: {
    search?: string;
    status?: string;
  };
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input name="search" defaultValue={defaults.search} placeholder="Search by order id" className="pl-9" />
          </div>
          <select
            name="status"
            defaultValue={defaults.status ?? ""}
            className="h-10 rounded-xl border bg-white px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <Button type="submit">Apply</Button>
          <Button asChild variant="outline" type="button">
            <Link href={routes.orders}>Clear</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
