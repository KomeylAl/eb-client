"use client";

import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import { Dropdown } from "./Dropdown";
import { LogOut, User } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  const roleLabel = user?.is_client && user?.is_participant
    ? "مراجع و شرکت‌کننده"
    : user?.is_client
      ? "مراجع"
      : "شرکت‌کننده";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <User size={18} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute left-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-700"
      >
        <div>
          <span className="block font-medium text-gray-700 dark:text-gray-200">
            {user?.name || "کاربر"}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {roleLabel}
          </span>
        </div>
        <div className="mt-3 border-b border-gray-200 pb-3 dark:border-gray-800" />
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-2 rounded-md p-2 text-rose-500 transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <LogOut size={20} /> خروج
        </button>
      </Dropdown>
    </div>
  );
}
