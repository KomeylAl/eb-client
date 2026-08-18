"use client";

import PageFrame from "@/components/layout/PageFrame";
import ClientOnly from "@/components/common/ClientOnly";
import { Button } from "@/components/ui/button";
import { usePlusList } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { dateConvert, homeworkTypeLabel, statusLabel } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";

export default function HomeworksPage() {
  const { user } = useUser();
  const qc = useQueryClient();
  const { data, isLoading } = usePlusList(
    "homeworks?per_page=50",
    Boolean(user?.is_client)
  );
  const items = data?.data?.items ?? [];

  const { mutate: complete, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/plus/homeworks/${id}/complete`, {
        method: "PATCH",
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ثبت تکلیف");
      return payload;
    },
    onError: (e: Error) => toast.error(e.message),
    onSuccess: () => {
      toast.success("تکلیف انجام‌شده ثبت شد");
      qc.invalidateQueries({ queryKey: ["plus"] });
    },
  });

  return (
    <PageFrame title="تکالیف" description="تکالیف جلسات درمان که برای شما ثبت شده است">
      <ClientOnly>
        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={50} color="#3e86fa" />
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground dark:bg-gray-800 dark:border-gray-700">
            هنوز تکلیفی برای شما ثبت نشده است.
          </div>
        )}
        <div className="space-y-3">
          {items.map((hw: any) => (
            <div
              key={hw.id}
              className="rounded-2xl border bg-white p-5 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{hw.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {homeworkTypeLabel(hw.type)} · {statusLabel(hw.status)}
                    {hw.due_at ? ` · موعد ${dateConvert(hw.due_at)}` : ""}
                    {hw.appointment?.date
                      ? ` · جلسه ${dateConvert(hw.appointment.date)}`
                      : ""}
                  </p>
                  {hw.body && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                      {hw.body}
                    </p>
                  )}
                </div>
                {hw.status === "assigned" && (
                  <Button
                    disabled={isPending}
                    onClick={() => complete(hw.id)}
                  >
                    انجام شد
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ClientOnly>
    </PageFrame>
  );
}
