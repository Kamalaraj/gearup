import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid object id");

export const mongoIdParamSchema = z.object({
  id: objectIdSchema
});

export const emailSchema = z.string().trim().email("Enter a valid email address");
export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Phone number is too short")
  .max(20, "Phone number is too long");
