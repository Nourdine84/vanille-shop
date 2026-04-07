"use client";

import { UIProvider } from "@/components/ui-providers";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UIProvider>{children}</UIProvider>;
}