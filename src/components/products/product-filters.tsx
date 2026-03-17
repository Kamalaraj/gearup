import Link from "next/link";
import { Search } from "lucide-react";

import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProductFilters({
  categories,
  defaults
}: {
  categories: string[];
  defaults: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="grid gap-3 md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input name="search" placeholder="Search products" defaultValue={defaults.search} className="pl-9" />
          </div>
          <select
            name="category"
            defaultValue={defaults.category ?? ""}
            className="h-10 rounded-xl border bg-white px-3 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Input name="minPrice" type="number" min={0} placeholder="Min price" defaultValue={defaults.minPrice} />
          <Input name="maxPrice" type="number" min={0} placeholder="Max price" defaultValue={defaults.maxPrice} />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="sortBy"
              defaultValue={defaults.sortBy ?? "createdAt"}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="createdAt">Newest</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
            <select
              name="sortOrder"
              defaultValue={defaults.sortOrder ?? "desc"}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
          <div className="flex gap-3 md:col-span-6">
            <Button type="submit">Apply filters</Button>
            <Button asChild type="button" variant="outline">
              <Link href={routes.products}>Clear filters</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
