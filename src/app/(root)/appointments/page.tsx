"use client";

import PageFrame from "@/components/layout/PageFrame";
import ClientOnly from "@/components/common/ClientOnly";
import Table from "@/components/common/Table";
import TransitionLink from "@/components/common/TransitionLink";
import { usePlusList } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { dateConvert, statusLabel } from "@/lib/utils";
import { PuffLoader } from "react-spinners";

export default function AppointmentsPage() {
  const { user } = useUser();
  const { data, isLoading } = usePlusList(
    "appointments?per_page=50",
    Boolean(user?.is_client)
  );
  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  return (
    <PageFrame title="نوبت‌ها" description="نوبت‌های ثبت‌شده شما در کلینیک ابراز">
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
                header: "درمانگر",
                accessor: (row: any) => row.doctor?.name ?? "—",
              },
              {
                header: "تاریخ و ساعت",
                accessor: (row: any) =>
                  `${dateConvert(row.date)} — ${row.time ?? ""}`,
              },
              {
                header: "وضعیت",
                accessor: (row: any) => statusLabel(row.status),
                cellClassName: (row: any) =>
                  row.status === "done" ? "text-blue-600" : "text-amber-600",
              },
              {
                header: "پرداخت",
                accessor: (row: any) => statusLabel(row.payment?.status),
              },
              {
                header: "جزئیات",
                accessor: (row: any) => (
                  <TransitionLink
                    href={`/appointments/${row.id}`}
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
