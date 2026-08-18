import {
  authHeaders,
  backendUrl,
  clearAuthTokenCookie,
  getAuthToken,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = getAuthToken(req);
  if (token) {
    await fetch(backendUrl("api/v1/plus/logout"), {
      method: "POST",
      headers: authHeaders(token),
    }).catch(() => null);
  }

  const res = NextResponse.json({ message: "خروج انجام شد" });
  clearAuthTokenCookie(res);
  return res;
}
