"use client";

import { ReactNode } from "react";
import { UIProvider } from "@/components/ui-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return <UIProvider>{children}</UIProvider>;
}