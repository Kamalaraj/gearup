import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildQueryString } from "@/lib/utils";

export function PaginationControls({
  page,
  totalPages,
  pathname,
  query
}: {
  page: number;
  totalPages: number;
  pathname: string;
  query: Record<string, string | number | undefined | null>;
}) {
  const previousHref = `${pathname}?${buildQueryString({ ...query, page: page - 1, limit: 9 })}`;
  const nextHref = `${pathname}?${buildQueryString({ ...query, page: page + 1, limit: 9 })}`;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page <= 1 ? (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={previousHref}>Previous</Link>
          </Button>
        )}
        {page >= totalPages ? (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={nextHref}>Next</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
