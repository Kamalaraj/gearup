import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { objectIdSchema } from "@/schemas/common.schema";
import { cartService } from "@/services/cart.service";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const cartId = objectIdSchema.safeParse(resolvedParams.id);

    if (!cartId.success) {
      return errorResponse("Invalid cart id", 400, cartId.error.flatten());
    }

    const cart = await cartService.softRemoveItem(cartId.data, resolvedParams.itemId);
    return successResponse({ message: "Item removed", cart });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to remove item", 400);
  }
}
