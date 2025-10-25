"use client";

import type React from "react";

import { lazy, Suspense, type ComponentType } from "react";
import { Loading } from "@/components/ui/loading";

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

export function LazyComponent({
  component,
  props = {},
  fallback,
}: LazyComponentProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense
      fallback={fallback || <Loading variant="gear" className="py-8" />}
    >
      <LazyComponent {...props} />
    </Suspense>
  );
}
