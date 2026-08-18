"use client";

import CertificatePreview from "@/components/CertificatePreview";
import PageFrame from "@/components/layout/PageFrame";
import TransitionLink from "@/components/common/TransitionLink";
import {
  useWorkshop,
  useWorkshopCertificates,
  useWorkshopMaterials,
} from "@/hooks/usePlus";
import { CertificateRenderData } from "@/lib/certificate";
import { downloadCertificatePdf } from "@/lib/downloadCertificatePdf";
import { Button } from "@/components/ui/button";
import { use, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";

export default function WorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: workshopRes, isLoading } = useWorkshop(id);
  const { data: materialsRes } = useWorkshopMaterials(id);
  const { data: certsRes } = useWorkshopCertificates(id);
  const workshop = workshopRes?.data;
  const materials = materialsRes?.data ?? [];
  const certificates = certsRes?.data ?? [];
  const [exporting, setExporting] = useState(false);
  const [activePayload, setActivePayload] = useState<CertificateRenderData | null>(
    null
  );
  const exportRef = useRef<HTMLDivElement>(null);

  const exportPdf = async (payload: CertificateRenderData, filename: string) => {
    setActivePayload(payload);
    setExporting(true);
    await new Promise((r) => setTimeout(r, 80));
    try {
      const root = exportRef.current?.querySelector(
        "[data-certificate-root]"
      ) as HTMLElement | null;
      if (!root) throw new Error("پیش‌نمایش آماده نیست");
      await downloadCertificatePdf(root, filename);
    } catch (e: any) {
      toast.error(e?.message || "خطا در ساخت PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageFrame
      title={workshop?.title || "جزئیات کارگاه"}
      description={
        workshop
          ? `${workshop.type_label || workshop.type}${
              workshop.organizers ? ` · ${workshop.organizers}` : ""
            }`
          : undefined
      }
      actions={
        <TransitionLink href="/workshops" className="text-sm text-blue-600">
          بازگشت
        </TransitionLink>
      }
    >
      {isLoading && (
        <div className="flex justify-center py-16">
          <PuffLoader size={50} color="#3e86fa" />
        </div>
      )}
      {!isLoading && !workshop && (
        <p className="text-sm text-rose-600">کارگاه پیدا نشد یا دسترسی ندارید.</p>
      )}

      {workshop && (
        <>
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">منابع آموزشی</h3>
            {materials.length === 0 && (
              <p className="text-sm text-muted-foreground">هنوز منبعی ثبت نشده است.</p>
            )}
            {materials.map((m: any) => (
              <div
                key={m.id}
                className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.type === "link" ? "لینک" : "فایل"}
                    {m.original_name ? ` · ${m.original_name}` : ""}
                  </p>
                  {m.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {m.description}
                    </p>
                  )}
                </div>
                <div>
                  {m.type === "link" && m.link ? (
                    <Button asChild>
                      <a href={m.link} target="_blank" rel="noreferrer">
                        باز کردن
                      </a>
                    </Button>
                  ) : m.type === "file" && m.has_file ? (
                    <Button asChild>
                      <a href={`/api/plus/workshops/${id}/materials/${m.id}/download`}>
                        دانلود
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">گواهی</h3>
            {certificates.length === 0 && (
              <p className="text-sm text-muted-foreground">
                هنوز گواهی برای شما صادر نشده است.
              </p>
            )}
            {certificates.map((c: any) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium">شماره {c.certificate_number}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.issued_at ? String(c.issued_at).slice(0, 10) : ""}
                    {c.source_label ? ` · ${c.source_label}` : ""}
                  </p>
                </div>
                {c.has_file ? (
                  <Button asChild variant="outline">
                    <a
                      href={`/api/plus/workshops/${id}/certificates/${c.id}/download`}
                    >
                      دانلود مدرک
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled={exporting || !c.payload}
                    onClick={() =>
                      exportPdf(
                        c.payload as CertificateRenderData,
                        `${c.certificate_number}.pdf`
                      )
                    }
                  >
                    {exporting ? "در حال ساخت..." : "دانلود PDF"}
                  </Button>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      <div
        ref={exportRef}
        aria-hidden
        style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}
      >
        {activePayload && <CertificatePreview data={activePayload} scale={1} />}
      </div>
    </PageFrame>
  );
}
