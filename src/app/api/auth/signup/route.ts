import { cookies } from "next/headers";
import { MongoServerError } from "mongodb";

import { customerCookieName } from "@/constants/routes";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { signupSchema } from "@/schemas/customer.schema";
import { customerService } from "@/services/customer.service";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const customer = await customerService.signupCustomer(parsed.data);
    const cookieStore = await cookies();
    cookieStore.set(customerCookieName, customer._id.toString(), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });

    return successResponse({ message: "Signup successful", customer }, 201);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return errorResponse("Customer already exists", 409);
    }

    return errorResponse(error instanceof Error ? error.message : "Failed to sign up", 400);
  }
}
