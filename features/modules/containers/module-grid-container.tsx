"use client";

import React, { useMemo } from "react";
import { useModules } from "@/features/modules/hooks/use-modules";
import ModuleGrid from "@/features/modules/components/module-grid";
import type { ModuleData } from "@/types/module";

export default function ModuleGridContainer() {
  const { modules, activeModule, loading, error, onModuleClick } = useModules();

  const safeModules = useMemo<ModuleData[]>(() => modules ?? [], [modules]);

  if (error) {
    // 简单错误占位（页面已有 ErrorBoundary，容器内保留兜底）
    return (
      <div className="p-4 text-red-400">
        加载模块失败，请稍后重试。
      </div>
    );
  }

  if (loading && safeModules.length === 0) {
    return (
      <div className="p-4 text-[#D0D5DE]/60">正在加载模块...</div>
    );
  }

  return (
    <ModuleGrid
      modules={safeModules}
      activeModule={activeModule}
      onModuleClick={onModuleClick}
    />
  );
}
