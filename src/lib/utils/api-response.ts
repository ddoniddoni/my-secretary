import { NextResponse } from "next/server";

export function dataResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}
