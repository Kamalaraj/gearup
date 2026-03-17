import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(24).default(8),
  search: z.string().trim().optional().default(""),
  category: z.string().trim().optional().default(""),
  sortBy: z.enum(["name", "price", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  status: z.string().trim().optional().default("")
});

export type ParsedPaginationQuery = z.infer<typeof paginationQuerySchema>;

export function parsePaginationQuery(input: Record<string, string | string[] | undefined>) {
  return paginationQuerySchema.parse({
    page: input.page,
    limit: input.limit,
    search: input.search,
    category: input.category,
    sortBy: input.sortBy,
    sortOrder: input.sortOrder,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
    status: input.status
  });
}
