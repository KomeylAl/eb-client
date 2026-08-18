"use client";

import Header from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboard } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import TransitionLink from "@/components/common/TransitionLink";
import {
  Award,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  FolderHeart,
  GraduationCap,
  ListTodo,
} from "lucide-react";
import { PuffLoader } from "react-spinners";

export default function Home() {
  const { user } = useUser();
  const { data: stats, isLoading, error, refetch } = useDashboard();

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto">
      <Header />
      <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6 md:p-8">
        <div>
          <h2 className="text-2xl font-bold">داشبورد ابراز پلاس</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.name
              ? `${user.name} عزیز، خلاصه وضعیت شما`
              : "خلاصه نوبت‌ها، تکالیف و دوره‌ها"}
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/30">
            <p className="text-rose-600">خطا در دریافت آمار داشبورد</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="نوبت‌های امروز"
                value={stats.today_appointments}
                description="نوبت‌های ثبت‌شده برای امروز"
                icon={<CalendarClock size={20} />}
              />
              <StatCard
                title="نوبت‌های پیش رو"
                value={stats.upcoming_appointments}
                description="نوبت‌هایی که هنوز انجام نشده‌اند"
                icon={<CalendarCheck size={20} />}
                accentClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
              />
              <StatCard
                title="تکالیف باز"
                value={stats.pending_homeworks}
                description="تکالیفی که هنوز انجام نشده‌اند"
                icon={<ListTodo size={20} />}
                accentClassName="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300"
              />
              <StatCard
                title="کارگاه‌ها و دوره‌ها"
                value={stats.workshops}
                description={`${stats.certificates ?? 0} گواهی صادرشده`}
                icon={<GraduationCap size={20} />}
                accentClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="برنامه‌های درمان"
                value={stats.treatment_programs}
                description="برنامه‌های فعال و قبلی شما"
                icon={<FolderHeart size={18} />}
              />
              <StatCard
                title="ارزیابی‌ها"
                value={stats.assessments}
                description={`${stats.pending_assessments ?? 0} مورد در انتظار`}
                icon={<ClipboardList size={18} />}
              />
              <StatCard
                title="گواهی‌ها"
                value={stats.certificates}
                description="گواهی دوره‌ها و کارگاه‌ها"
                icon={<Award size={18} />}
                accentClassName="bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/appointments", label: "نوبت‌ها" },
                { href: "/homeworks", label: "تکالیف" },
                { href: "/workshops", label: "کارگاه‌ها" },
                { href: "/treatment-programs", label: "برنامه‌های درمان" },
              ].map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  {item.label}
                </TransitionLink>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
