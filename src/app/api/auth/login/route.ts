import {
  authHeaders,
  backendUrl,
  getAuthToken,
  setAuthTokenCookie,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone, password, national_code } = await req.json();

  try {
    const response = await fetch(backendUrl("api/v1/plus/login"), {
      method: "POST",
      headers: authHeaders(undefined, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        phone,
        password: password || national_code,
        national_code: national_code || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ||
            payload?.errors?.phone?.[0] ||
            (response.status === 422
              ? "اطلاعات ورود اشتباه است."
              : "خطا در ورود"),
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    const token = payload?.data?.token;
    const user = payload?.data?.user;

    if (!token || !user) {
      return NextResponse.json(
        { message: "پاسخ نامعتبر از سرور دریافت شد." },
        { status: 502 }
      );
    }

    const res = NextResponse.json({
      message: payload?.message ?? "ورود موفق",
      user,
      token,
      token_type: payload?.data?.token_type ?? "Bearer",
    });
    setAuthTokenCookie(res, token);
    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: `خطا در ارتباط با سرور: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
