"use client";

import PageFrame from "@/components/layout/PageFrame";
import { useMyWorkshops } from "@/hooks/usePlus";
import TransitionLink from "@/components/common/TransitionLink";
import { Award, BookOpen, CalendarDays } from "lucide-react";
import { PuffLoader } from "react-spinners";

export default function WorkshopsPage() {
  const { data, isLoading, error } = useMyWorkshops();
  const workshops = data?.data ?? [];

  return (
    <PageFrame
      title="کارگاه‌ها و دوره‌ها"
      description="منابع آموزشی و گواهی رویدادهایی که در آن‌ها تأیید شده‌اید."
    >
      {isLoading && (
        <div className="flex justify-center py-16">
          <PuffLoader size={50} color="#3e86fa" />
        </div>
      )}
      {error && (
        <p className="text-sm text-rose-600">{(error as Error).message}</p>
      )}
      {!isLoading && workshops.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground dark:bg-gray-800 dark:border-gray-700">
          هنوز کارگاه یا دوره تأییدشده‌ای ندارید.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {workshops.map((w: any) => (
          <TransitionLink
            key={w.id}
            href={`/workshops/${w.id}`}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {w.type_label || w.type}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{w.title}</h2>
              </div>
              <BookOpen className="size-5 shrink-0 text-blue-500" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {(w.start_date || w.end_date) && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  {w.start_date || "—"}
                  {w.end_date ? ` تا ${w.end_date}` : ""}
                </span>
              )}
              <span>{w.materials_count ?? 0} منبع</span>
              {w.has_certificate && (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <Award className="size-3.5" />
                  گواهی آماده
                </span>
              )}
            </div>
          </TransitionLink>
        ))}
      </div>
    </PageFrame>
  );
}
