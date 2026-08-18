import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = getAuthToken(req);
  const body = await req.json();
  const response = await fetch(backendUrl("api/v1/plus/password"), {
    method: "POST",
    headers: authHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload ?? { message: "خطا" }, { status: response.status });
}
