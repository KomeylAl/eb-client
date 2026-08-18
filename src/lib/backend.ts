import { NextRequest, NextResponse } from "next/server";

function ensureTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

export const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
export const AUTH_TOKEN_COOKIE = "token";

export function authTokenCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    maxAge: AUTH_TOKEN_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function setAuthTokenCookie(res: NextResponse, token: string) {
  res.cookies.set(AUTH_TOKEN_COOKIE, token, authTokenCookieOptions());
}

export function clearAuthTokenCookie(res: NextResponse) {
  res.cookies.set(AUTH_TOKEN_COOKIE, "", {
    ...authTokenCookieOptions(),
    maxAge: 0,
  });
}

export function getBackendBaseUrl() {
  const base =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!base) {
    throw new Error(
      "BACKEND_API_URL or NEXT_PUBLIC_BACKEND_API_URL is not configured"
    );
  }
  return ensureTrailingSlash(base);
}

export function backendUrl(path: string) {
  const normalized = path.replace(/^\//, "");
  return `${getBackendBaseUrl()}${normalized}`;
}

export function getAuthToken(req: NextRequest) {
  return req.cookies.get(AUTH_TOKEN_COOKIE)?.value;
}

export function authHeaders(token?: string, extra: HeadersInit = {}) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export function adaptBackendResponse(payload: unknown) {
  return payload ?? {};
}
