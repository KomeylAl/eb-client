import { adaptBackendResponse, authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = getAuthToken(req);
  const { id } = await params;
  const response = await fetch(backendUrl(`api/v1/plus/workshops/${id}`), {
    headers: authHeaders(token),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
