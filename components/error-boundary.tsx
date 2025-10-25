"use client";

import type { ReactNode } from "react";

export function ErrorBoundary({ children }: { children: ReactNode; className?: string; fallback?: ReactNode }): ReactNode {
  return children;
}
