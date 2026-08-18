"use client";

import Link from "next/link";

export default function TransitionLink({
  href,
  children,
  className = "",
  title,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} className={className} title={title} onClick={onClick}>
      {children}
    </Link>
  );
}
