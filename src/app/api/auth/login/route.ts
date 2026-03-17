import { cookies } from "next/headers";

import { customerCookieName } from "@/constants/routes";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { loginSchema } from "@/schemas/customer.schema";
import { customerService } from "@/services/customer.service";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const customer = await customerService.loginCustomer(parsed.data);
    const cookieStore = await cookies();
    cookieStore.set(customerCookieName, customer._id.toString(), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });

    return successResponse({ message: "Login successful", customer });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to log in", 400);
  }
}
