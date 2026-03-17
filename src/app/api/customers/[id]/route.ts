import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { objectIdSchema } from "@/schemas/common.schema";
import { customerService } from "@/services/customer.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const parsedId = objectIdSchema.safeParse(resolvedParams.id);

    if (!parsedId.success) {
      return errorResponse("Invalid customer id", 400, parsedId.error.flatten());
    }

    const customer = await customerService.getCustomerById(parsedId.data);

    if (!customer) {
      return errorResponse("Customer not found", 404);
    }

    return successResponse({ customer });
  } catch {
    return errorResponse("Failed to fetch customer");
  }
}

