import { ZodError } from "zod";
import { MongoServerError } from "mongodb";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { createOrderSchema, orderListQuerySchema } from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = orderListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const orders = await orderService.listOrders(query);
    return successResponse(orders);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Invalid order query", 400, error.flatten());
    }

    return errorResponse("Failed to fetch orders");
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const result = await orderService.createOrder(parsed.data);
    return successResponse(
      {
        message: "Order placed successfully",
        order: result.order,
        emailResult: result.emailResult
      },
      201,
    );
  } catch (error) {
    if (error instanceof MongoServerError) {
      return errorResponse(error.message, 500, {
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
    }

    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, error.flatten());
    }

    return errorResponse(error instanceof Error ? error.message : "Failed to place order", 400);
  }
}
