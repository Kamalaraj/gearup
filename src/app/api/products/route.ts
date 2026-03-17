import { ZodError } from "zod";
import { MongoServerError } from "mongodb";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { productFormSchema, productQuerySchema } from "@/schemas/product.schema";
import { productService } from "@/services/product.service";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const products = await productService.listProducts(query);
    return successResponse(products);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Invalid product query", 400, error.flatten());
    }

    return errorResponse("Failed to fetch products");
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = productFormSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const product = await productService.createProduct(parsed.data);
    return successResponse({ message: "Product created successfully", product }, 201);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return errorResponse("Product already exists", 409, {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
    }

    if (error instanceof ZodError) {
      return errorResponse("Invalid product payload", 400, error.flatten());
    }

    return errorResponse(error instanceof Error ? error.message : "Failed to create product", 500);
  }
}
