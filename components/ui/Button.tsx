"use client";

import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    "px-6 py-3 rounded-lg font-semibold transition inline-block text-center";

  const style =
    variant === "primary"
      ? "bg-amber-700 text-white hover:bg-amber-800"
      : "border border-amber-700 text-amber-700 hover:bg-amber-100";

  if (href) {
    return (
      <Link href={href} className={`${base} ${style} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
}

