import { adaptBackendResponse, authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  const response = await fetch(backendUrl("api/v1/plus/workshops"), {
    headers: authHeaders(token),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
