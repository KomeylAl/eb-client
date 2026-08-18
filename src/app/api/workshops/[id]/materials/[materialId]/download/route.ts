import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; materialId: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = getAuthToken(req);
  const { id, materialId } = await params;
  const response = await fetch(
    backendUrl(`api/v1/plus/workshops/${id}/materials/${materialId}/download`),
    { headers: authHeaders(token) }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  }

  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  const disposition = response.headers.get("content-disposition");
  if (contentType) headers.set("content-type", contentType);
  if (disposition) headers.set("content-disposition", disposition);

  return new NextResponse(response.body, {
    status: 200,
    headers,
  });
}
