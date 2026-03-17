import { cookies } from "next/headers";
import { getUploadAuthParams } from "@imagekit/next/server";

import { customerCookieName } from "@/constants/routes";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const customerId = cookieStore.get(customerCookieName)?.value;

    if (!customerId) {
      return errorResponse("Unauthorized upload request", 401);
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return errorResponse("ImageKit environment variables are not configured.", 500);
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey
    });

    return successResponse({ token, expire, signature, publicKey });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to generate upload auth", 500);
  }
}
