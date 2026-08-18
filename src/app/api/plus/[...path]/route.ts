import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, { params }: Ctx) {
  const token = getAuthToken(req);
  const { path } = await params;
  const target = backendUrl(`api/v1/plus/${path.join("/")}${req.nextUrl.search}`);

  const headers = authHeaders(token);
  const init: RequestInit = {
    method: req.method,
    headers: {
      ...headers,
      ...(req.method !== "GET" && req.method !== "HEAD"
        ? { "Content-Type": "application/json" }
        : {}),
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const response = await fetch(target, init);

  if (response.headers.get("content-type")?.includes("application/json")) {
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? {}, { status: response.status });
  }

  const headersOut = new Headers();
  const contentType = response.headers.get("content-type");
  const disposition = response.headers.get("content-disposition");
  if (contentType) headersOut.set("content-type", contentType);
  if (disposition) headersOut.set("content-disposition", disposition);

  return new NextResponse(response.body, {
    status: response.status,
    headers: headersOut,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
