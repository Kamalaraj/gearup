import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      message,
      ...(details ? { details } : {})
    },
    { status },
  );
}
