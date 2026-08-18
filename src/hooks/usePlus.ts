"use client";

import { useQuery } from "@tanstack/react-query";

export function useMyWorkshops() {
  return useQuery({
    queryKey: ["plus-workshops"],
    queryFn: async () => {
      const res = await fetch("/api/plus/workshops");
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در دریافت کارگاه‌ها");
      return payload;
    },
  });
}

export function useWorkshop(id: string) {
  return useQuery({
    queryKey: ["plus-workshop", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/plus/workshops/${id}`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا");
      return payload;
    },
  });
}

export function useWorkshopMaterials(id: string) {
  return useQuery({
    queryKey: ["plus-materials", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/plus/workshops/${id}/materials`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا");
      return payload;
    },
  });
}

export function useWorkshopCertificates(id: string) {
  return useQuery({
    queryKey: ["plus-certificates", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/plus/workshops/${id}/certificates`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا");
      return payload;
    },
  });
}

export function useMyCertificates() {
  return useQuery({
    queryKey: ["plus-my-certificates"],
    queryFn: async () => {
      const res = await fetch("/api/plus/certificates");
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در دریافت گواهی‌ها");
      return payload;
    },
  });
}
