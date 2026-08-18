"use client";

import PageFrame from "@/components/layout/PageFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useChangePassword, useRequestPasswordOtp } from "@/hooks/useAuth";
import { dateConvert } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [passwordForm, setPasswordForm] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });

  const { mutate: requestPasswordOtp, isPending: isRequestingOtp } =
    useRequestPasswordOtp(() => {
      setIsCodeSent(true);
      setResendSeconds(60);
    });

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(() => {
      setIsCodeSent(false);
      setResendSeconds(0);
      setPasswordForm({ code: "", password: "", password_confirmation: "" });
    });

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeSent) {
      requestPasswordOtp();
      return;
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("تکرار رمز عبور مطابقت ندارد.");
      return;
    }
    changePassword(passwordForm);
  };

  return (
    <PageFrame title="تنظیمات" description="حساب کاربری و ظاهر پنل">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold">پروفایل</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p>نام: {user?.name ?? "—"}</p>
            <p>شماره: {user?.phone ?? "—"}</p>
            {user?.birth_date && <p>تاریخ تولد: {dateConvert(user.birth_date)}</p>}
            <p>
              نقش:{" "}
              {user?.is_client && user?.is_participant
                ? "مراجع و شرکت‌کننده"
                : user?.is_client
                  ? "مراجع"
                  : "شرکت‌کننده"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold">ظاهر</h3>
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "حالت روشن" : "حالت تیره"}
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6 lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold">تغییر رمز عبور</h3>
          {!user?.is_client ? (
            <p className="mt-3 text-sm text-muted-foreground">
              شرکت‌کنندگان دوره‌ها با کد ملی وارد می‌شوند. برای تعیین رمز اختصاصی،
              حساب مراجع در کلینیک باید برای شما فعال شود.
            </p>
          ) : (
            <form className="mt-4 max-w-md space-y-4" onSubmit={handleChangePassword}>
              {isCodeSent && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="code">کد تأیید</Label>
                    <Input
                      id="code"
                      value={passwordForm.code}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          code: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-password">رمز جدید</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">تکرار رمز جدید</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.password_confirmation}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          password_confirmation: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isRequestingOtp || isChangingPassword}>
                  {isCodeSent
                    ? isChangingPassword
                      ? "در حال ذخیره..."
                      : "ثبت رمز جدید"
                    : isRequestingOtp
                      ? "در حال ارسال کد..."
                      : "ارسال کد تأیید"}
                </Button>
                {isCodeSent && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={resendSeconds > 0 || isRequestingOtp}
                    onClick={() => requestPasswordOtp()}
                  >
                    {resendSeconds > 0
                      ? `ارسال مجدد تا ${resendSeconds}`
                      : "ارسال مجدد"}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
