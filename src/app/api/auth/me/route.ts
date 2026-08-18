import { adaptBackendResponse, authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const response = await fetch(backendUrl("api/v1/plus/me"), {
    headers: authHeaders(token),
  });
  const payload = adaptBackendResponse(await response.json().catch(() => ({}))) as {
    message?: string;
    data?: unknown;
  };

  return NextResponse.json(
    {
      message: payload?.message ?? "Success",
      user: payload?.data ?? null,
    },
    { status: response.status }
  );
}
