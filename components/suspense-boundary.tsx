"use client";

import { Suspense, type ReactNode } from "react";
import { Loading } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { useLanguage } from "@/contexts/language-context";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function SuspenseBoundary({
  children,
  fallback,
  errorFallback,
}: SuspenseBoundaryProps) {
  const { t } = useLanguage();

  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loading variant="gear" text={t("加载中...", "Loading...")} />
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
