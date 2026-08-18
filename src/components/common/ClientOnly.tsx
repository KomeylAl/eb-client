"use client";

import { useUser } from "@/contexts/UserContext";

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (user && !user.is_client) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground dark:bg-gray-800 dark:border-gray-700">
        این بخش مخصوص مراجعان کلینیک است. اگر نوبت یا برنامه درمان دارید، با پذیرش
        کلینیک هماهنگ کنید تا حساب مراجع برای شما فعال شود.
      </div>
    );
  }

  return <>{children}</>;
}
