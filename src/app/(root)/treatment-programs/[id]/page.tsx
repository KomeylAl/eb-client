"use client";

import PageFrame from "@/components/layout/PageFrame";
import TransitionLink from "@/components/common/TransitionLink";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePlusList } from "@/hooks/useAuth";
import { dateConvert, statusLabel } from "@/lib/utils";
import { use, useMemo } from "react";
import { PuffLoader } from "react-spinners";

export default function TreatmentProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = usePlusList(`treatment-programs/${id}`);
  const program = data?.data;
  const appointments = program?.appointments ?? [];
  const progress = program?.progress;
  const homeworks = useMemo(
    () =>
      appointments.flatMap((app: any) =>
        (app.homeworks ?? []).map((hw: any) => ({
          ...hw,
          appointment_date: app.date,
        }))
      ),
    [appointments]
  );

  return (
    <PageFrame
      title={program?.title || "برنامه درمان"}
      description={program?.doctor?.name ? `درمانگر: ${program.doctor.name}` : undefined}
      actions={
        <TransitionLink href="/treatment-programs" className="text-sm text-blue-600">
          بازگشت
        </TransitionLink>
      }
    >
      {isLoading && (
        <div className="flex justify-center py-16">
          <PuffLoader size={50} color="#3e86fa" />
        </div>
      )}
      {program && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="جلسات"
              value={progress?.sessions_total ?? appointments.length}
              description={`${progress?.sessions_done ?? 0} انجام‌شده`}
            />
            <StatCard
              title="تکالیف"
              value={progress?.homeworks_total ?? homeworks.length}
              description={`${progress?.homeworks_done ?? 0} انجام‌شده`}
            />
            <StatCard
              title="وضعیت"
              value={statusLabel(program.status)}
              description={
                program.started_at
                  ? `شروع از ${dateConvert(program.started_at)}`
                  : undefined
              }
            />
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">جلسات</h3>
            {appointments.length === 0 && (
              <p className="text-sm text-muted-foreground">جلسه‌ای ثبت نشده است.</p>
            )}
            {appointments.map((app: any) => (
              <TransitionLink
                key={app.id}
                href={`/appointments/${app.id}`}
                className="block rounded-xl border bg-white p-4 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <p>
                    {dateConvert(app.date)} — {app.time}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {statusLabel(app.status)}
                  </span>
                </div>
              </TransitionLink>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">تکالیف</h3>
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
                    {statusLabel(hw.status)}
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
