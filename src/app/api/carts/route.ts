import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { cartQuerySchema, createCartSchema } from "@/schemas/cart.schema";
import { cartService } from "@/services/cart.service";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = cartQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const cart = await cartService.getActiveCart(query.customerId);

    if (!cart) {
      return errorResponse("Cart not found", 404);
    }

    return successResponse({ cart });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Invalid query parameters", 400, error.flatten());
    }

    return errorResponse("Failed to fetch cart");
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createCartSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const cart = await cartService.addItem(parsed.data);
    return successResponse({ message: "Product added to cart", cart }, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update cart", 400);
  }
}
