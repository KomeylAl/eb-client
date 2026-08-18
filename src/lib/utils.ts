import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateConvert(app_date?: string | null) {
  if (!app_date) return "—";
  const date = new Date(app_date);
  if (Number.isNaN(date.getTime())) return app_date;
  return date.toLocaleDateString("fa-IR");
}

export function statusLabel(status?: string | null) {
  switch (status) {
    case "pending":
      return "در انتظار";
    case "done":
      return "انجام‌شده";
    case "assigned":
      return "محول‌شده";
    case "cancelled":
      return "لغو شده";
    case "active":
      return "فعال";
    case "completed":
      return "تکمیل‌شده";
    case "paused":
      return "متوقف";
    case "paid":
      return "پرداخت‌شده";
    case "unpaid":
      return "پرداخت‌نشده";
    default:
      return status || "—";
  }
}

export function homeworkTypeLabel(type?: string | null) {
  switch (type) {
    case "text":
      return "متنی";
    case "file":
      return "فایل";
    case "link":
      return "لینک";
    case "checklist":
      return "چک‌لیست";
    default:
      return type || "—";
  }
}
