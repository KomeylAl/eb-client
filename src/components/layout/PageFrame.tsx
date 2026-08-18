"use client";

import Header from "@/components/layout/Header";

export default function PageFrame({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
