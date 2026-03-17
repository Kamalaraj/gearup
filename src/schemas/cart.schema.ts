import { z } from "zod";

import { objectIdSchema } from "@/schemas/common.schema";

export const createCartSchema = z.object({
  customerId: objectIdSchema,
  productId: objectIdSchema,
  quantity: z.coerce.number().int().min(1).max(10)
});

export const updateCartItemSchema = z.object({
  itemId: z.string().uuid("Invalid cart item id"),
  quantity: z.coerce.number().int().min(1).max(10)
});

export const cartQuerySchema = z.object({
  customerId: objectIdSchema
});

export type CreateCartInput = z.infer<typeof createCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
