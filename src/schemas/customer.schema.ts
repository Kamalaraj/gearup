import { z } from "zod";

import { emailSchema, phoneSchema } from "@/schemas/common.schema";

export const customerFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().trim().min(8, "Address is required")
});

export const signupSchema = customerFormSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less")
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

export const customerListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(10),
  search: z.string().trim().optional().default("")
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
