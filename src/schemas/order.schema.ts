import { z } from "zod";

import { emailSchema, objectIdSchema, phoneSchema } from "@/schemas/common.schema";

export const deliveryDetailsSchema = z.object({
  recipientName: z.string().trim().min(2, "Recipient name is required"),
  phone: phoneSchema,
  addressLine1: z.string().trim().min(5, "Address line 1 is required"),
  addressLine2: z.string().trim().optional().default(""),
  city: z.string().trim().min(2, "City is required"),
  postalCode: z.string().trim().min(3, "Postal code is required")
});

export const createOrderSchema = z.object({
  customerId: objectIdSchema,
  cartId: objectIdSchema,
  email: emailSchema,
  deliveryDetails: deliveryDetailsSchema
});

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(10),
  status: z.string().trim().optional().default(""),
  customerId: objectIdSchema.optional(),
  search: z.string().trim().optional().default("")
});

export type DeliveryDetailsValues = z.infer<typeof deliveryDetailsSchema>;
