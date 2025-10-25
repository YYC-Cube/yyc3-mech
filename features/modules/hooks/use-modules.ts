"use client";

import { useEffect, useCallback } from "react";
import { useModuleStore } from "@/store/module-store";
import { handleError } from "@/lib/error-handler";

export function useModules() {
  const {
    modules,
    activeModule,
    loading,
    error,
    fetchModules,
    setActiveModule,
    toggleFavorite,
    rateModule,
  } = useModuleStore();

  useEffect(() => {
    // 初始加载模块数据
    fetchModules().catch((err) => {
      handleError(err, {
        tags: ["modules-hook", "fetch-modules"],
        showToUser: true,
      });
    });
  }, [fetchModules]);

  const onModuleClick = useCallback(
    (id: string) => {
      setActiveModule(id);
    },
    [setActiveModule],
  );

  return {
    modules,
    activeModule,
    loading,
    error,
    onModuleClick,
    toggleFavorite,
    rateModule,
  };
}
