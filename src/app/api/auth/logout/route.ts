import { cookies } from "next/headers";

import { customerCookieName } from "@/constants/routes";
import { successResponse } from "@/lib/api-response";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(customerCookieName, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0
  });

  return successResponse({ message: "Logout successful" });
}
