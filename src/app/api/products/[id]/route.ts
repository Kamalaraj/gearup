import { cookies } from "next/headers";
import { ZodError } from "zod";

import { customerCookieName } from "@/constants/routes";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { productFormSchema, productIdParamSchema } from "@/schemas/product.schema";
import { productService } from "@/services/product.service";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const parsedParams = productIdParamSchema.safeParse(resolvedParams);

    if (!parsedParams.success) {
      return errorResponse("Invalid product id", 400, parsedParams.error.flatten());
    }

    const product = await productService.getProductById(parsedParams.data.id);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ product });
  } catch {
    return errorResponse("Failed to fetch product");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const parsedParams = productIdParamSchema.safeParse(resolvedParams);

    if (!parsedParams.success) {
      return errorResponse("Invalid product id", 400, parsedParams.error.flatten());
    }

    const body = await request.json();
    const parsedBody = productFormSchema.safeParse(body);

    if (!parsedBody.success) {
      return errorResponse("Validation failed", 400, parsedBody.error.flatten());
    }

    const product = await productService.updateProduct(parsedParams.data.id, parsedBody.data);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ message: "Product updated successfully", product });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Invalid product payload", 400, error.flatten());
    }

    return errorResponse(error instanceof Error ? error.message : "Failed to update product", 500);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const parsedParams = productIdParamSchema.safeParse(resolvedParams);

    if (!parsedParams.success) {
      return errorResponse("Invalid product id", 400, parsedParams.error.flatten());
    }

    const cookieStore = await cookies();
    const deletedBy = cookieStore.get(customerCookieName)?.value ?? null;
    const product = await productService.softDeleteProduct(parsedParams.data.id, deletedBy);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ message: "Product deleted successfully", product });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete product", 500);
  }
}
