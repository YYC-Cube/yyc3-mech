"use client";

import { useEffect } from "react";
import { setupMonitoring } from "@/lib/monitoring";
import { errorLogger } from "@/lib/error-logger";

export default function MonitoringInit() {
  useEffect(() => {
    // 初始化全局错误监听并启动监控
    errorLogger.init();
    setupMonitoring();
  }, []);
  return null;
}
