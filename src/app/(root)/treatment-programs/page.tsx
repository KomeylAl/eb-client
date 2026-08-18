"use client";

import PageFrame from "@/components/layout/PageFrame";
import ClientOnly from "@/components/common/ClientOnly";
import Table from "@/components/common/Table";
import TransitionLink from "@/components/common/TransitionLink";
import { usePlusList } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { dateConvert, statusLabel } from "@/lib/utils";
import { PuffLoader } from "react-spinners";

export default function TreatmentProgramsPage() {
  const { user } = useUser();
  const { data, isLoading } = usePlusList(
    "treatment-programs?per_page=50",
    Boolean(user?.is_client)
  );
  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  return (
    <PageFrame
      title="برنامه‌های درمان"
      description="برنامه‌های درمانی ثبت‌شده برای شما"
    >
      <ClientOnly>
        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={50} color="#3e86fa" />
          </div>
        )}
        {!isLoading && (
          <Table
            data={items}
            columns={[
              {
                header: "عنوان",
                accessor: (row: any) => row.title ?? "—",
              },
              {
                header: "درمانگر",
                accessor: (row: any) => row.doctor?.name ?? "—",
              },
              {
                header: "شروع",
                accessor: (row: any) => dateConvert(row.started_at),
              },
              {
                header: "وضعیت",
                accessor: (row: any) => statusLabel(row.status),
              },
              {
                header: "جلسات",
                accessor: (row: any) => row.appointments_count ?? 0,
              },
              {
                header: "جزئیات",
                accessor: (row: any) => (
                  <TransitionLink
                    href={`/treatment-programs/${row.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    مشاهده
                  </TransitionLink>
                ),
              },
            ]}
            currentPage={meta?.current_page ?? 1}
            pageSize={meta?.per_page ?? 50}
            totalItems={meta?.total ?? items.length}
          />
        )}
      </ClientOnly>
    </PageFrame>
  );
}
