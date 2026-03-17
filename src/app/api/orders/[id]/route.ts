import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { objectIdSchema } from "@/schemas/common.schema";
import { orderService } from "@/services/order.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const parsedId = objectIdSchema.safeParse(resolvedParams.id);

    if (!parsedId.success) {
      return errorResponse("Invalid order id", 400, parsedId.error.flatten());
    }

    const order = await orderService.getOrderById(parsedId.data);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    return successResponse({ order });
  } catch {
    return errorResponse("Failed to fetch order");
  }
}
