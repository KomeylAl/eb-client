"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export type PlusUser = {
  id: string;
  name: string;
  phone: string;
  birth_date?: string | null;
  address?: string | null;
  is_client: boolean;
  is_participant: boolean;
  has_password: boolean;
  english_name?: string | null;
  gender?: string | null;
};

type UserContextType = {
  user: PlusUser | null;
  setUser: (user: PlusUser | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<PlusUser | null>(null);
  const router = useRouter();

  const setUser = useCallback((next: PlusUser | null) => {
    setUserState(next);
    if (next) {
      localStorage.setItem("user", JSON.stringify(next));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }

    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return;
        const payload = await res.json().catch(() => null);
        if (payload?.user) setUser(payload.user);
      })
      .catch(() => null);
  }, [setUser]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {
      toast.error("مشکلی در خروج پیش آمد");
    });
    setUser(null);
    router.replace("/auth/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
