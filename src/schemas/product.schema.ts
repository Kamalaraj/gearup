import { z } from "zod";

import { objectIdSchema } from "@/schemas/common.schema";

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(9).max(9).default(9),
  search: z.string().trim().optional().default(""),
  category: z.string().trim().optional().default(""),
  sortBy: z.enum(["name", "price", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional()
});

export const productSeedSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  category: z.string().trim().min(2),
  image: z.string().trim().url(),
  price: z.number().min(0),
  stockQuantity: z.number().int().min(0),
  isActive: z.boolean().optional().default(true)
});

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().trim().min(2, "Category is required"),
  image: z.string().trim().url("Image must be a valid URL"),
  price: z.coerce.number().min(0, "Price must be zero or more"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be zero or more"),
  isActive: z.boolean().default(true)
});

export const productIdParamSchema = z.object({
  id: objectIdSchema
});

export type ProductSeedInput = z.infer<typeof productSeedSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
