"use client";

import PageFrame from "@/components/layout/PageFrame";
import TransitionLink from "@/components/common/TransitionLink";
import { usePlusList } from "@/hooks/useAuth";
import { dateConvert, homeworkTypeLabel, statusLabel } from "@/lib/utils";
import { use, useMemo } from "react";
import { PuffLoader } from "react-spinners";

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = usePlusList(`appointments/${id}`);
  const appointment = data?.data;
  const homeworks = useMemo(
    () => appointment?.homeworks ?? [],
    [appointment?.homeworks]
  );

  return (
    <PageFrame
      title="جزئیات نوبت"
      actions={
        <TransitionLink href="/appointments" className="text-sm text-blue-600">
          بازگشت
        </TransitionLink>
      }
    >
      {isLoading && (
        <div className="flex justify-center py-16">
          <PuffLoader size={50} color="#3e86fa" />
        </div>
      )}
      {appointment && (
        <div className="space-y-6">
          <div className="space-y-2 rounded-2xl border bg-white p-5 dark:bg-gray-800 dark:border-gray-700">
            <p>درمانگر: {appointment.doctor?.name ?? "—"}</p>
            <p>
              تاریخ: {dateConvert(appointment.date)} — {appointment.time}
            </p>
            <p>وضعیت: {statusLabel(appointment.status)}</p>
            {appointment.room?.name && <p>اتاق: {appointment.room.name}</p>}
            {appointment.service && <p>خدمت: {appointment.service}</p>}
            {appointment.treatment_program_id && (
              <TransitionLink
                href={`/treatment-programs/${appointment.treatment_program_id}`}
                className="inline-block text-sm text-blue-600"
              >
                مشاهده برنامه درمان
              </TransitionLink>
            )}
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">تکالیف این جلسه</h3>
            {homeworks.length === 0 && (
              <p className="text-sm text-muted-foreground">تکلیفی ثبت نشده است.</p>
            )}
            {homeworks.map((hw: any) => (
              <div
                key={hw.id}
                className="rounded-xl border bg-white p-4 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{hw.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {homeworkTypeLabel(hw.type)} · {statusLabel(hw.status)}
                  </span>
                </div>
                {hw.body && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    {hw.body}
                  </p>
                )}
              </div>
            ))}
          </section>
        </div>
      )}
    </PageFrame>
  );
}
