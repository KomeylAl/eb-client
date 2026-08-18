"use client";

import PageFrame from "@/components/layout/PageFrame";
import CertificatePreview from "@/components/CertificatePreview";
import { useMyCertificates } from "@/hooks/usePlus";
import { CertificateRenderData } from "@/lib/certificate";
import { downloadCertificatePdf } from "@/lib/downloadCertificatePdf";
import { Button } from "@/components/ui/button";
import TransitionLink from "@/components/common/TransitionLink";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";

export default function CertificatesPage() {
  const { data, isLoading } = useMyCertificates();
  const certificates = data?.data ?? [];
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
      title="گواهی‌ها"
      description="گواهی دوره‌ها، کارگاه‌ها و سمینارهایی که برای شما صادر شده است."
    >
      {isLoading && (
        <div className="flex justify-center py-16">
          <PuffLoader size={50} color="#3e86fa" />
        </div>
      )}
      {!isLoading && certificates.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground dark:bg-gray-800 dark:border-gray-700">
          هنوز گواهی‌ای صادر نشده است.
        </div>
      )}
      <div className="space-y-3">
        {certificates.map((c: any) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 dark:border-gray-700"
          >
            <div>
              <p className="font-medium">{c.workshop?.title || "گواهی"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                شماره {c.certificate_number}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {c.workshop_id && (
                <TransitionLink
                  href={`/workshops/${c.workshop_id}`}
                  className="text-sm text-blue-600"
                >
                  کارگاه
                </TransitionLink>
              )}
              {c.has_file ? (
                <Button asChild variant="outline">
                  <a
                    href={`/api/plus/workshops/${c.workshop_id}/certificates/${c.id}/download`}
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
                  دانلود PDF
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
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
