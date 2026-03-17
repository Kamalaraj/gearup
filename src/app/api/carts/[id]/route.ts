import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { objectIdSchema } from "@/schemas/common.schema";
import { updateCartItemSchema } from "@/schemas/cart.schema";
import { cartService } from "@/services/cart.service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const cartId = objectIdSchema.safeParse(resolvedParams.id);

    if (!cartId.success) {
      return errorResponse("Invalid cart id", 400, cartId.error.flatten());
    }

    const body = await request.json();
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const cart = await cartService.updateItemQuantity(cartId.data, parsed.data.itemId, parsed.data.quantity);
    return successResponse({ message: "Quantity updated", cart });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update cart", 400);
  }
}
