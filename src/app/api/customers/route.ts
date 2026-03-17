import { cookies } from "next/headers";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";

import { customerCookieName } from "@/constants/routes";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { customerFormSchema, customerListQuerySchema } from "@/schemas/customer.schema";
import { customerService } from "@/services/customer.service";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = customerListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const customers = await customerService.listCustomers(query.search, query.page, query.limit);
    return successResponse(customers);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Invalid query parameters", 400, error.flatten());
    }

    return errorResponse("Failed to fetch customers");
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = customerFormSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const customer = await customerService.createCustomer(parsed.data);
    const cookieStore = await cookies();
    cookieStore.set(customerCookieName, customer._id.toString(), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });

    return successResponse(
      {
        message: "Customer saved successfully",
        customer
      },
      201,
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return errorResponse("Customer already exists", 409, {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
    }

    return errorResponse(
      error instanceof Error ? error.message : "Failed to create customer",
      500,
    );
  }
}
