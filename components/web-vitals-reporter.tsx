"use client";

import { useEffect } from "react";
import { onCLS, onLCP, onTTFB, onINP } from "web-vitals";

function getRating(name: string, value: number, existing?: string) {
  const norm = (existing || '').toLowerCase();
  if (norm === 'good' || norm === 'needs-improvement' || norm === 'poor') return norm;
  switch (name) {
    case 'CLS':
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';
    case 'LCP':
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';
    case 'TTFB':
      if (value <= 800) return 'good';
      if (value <= 1800) return 'needs-improvement';
      return 'poor';
    case 'INP':
      if (value <= 200) return 'good';
      if (value <= 500) return 'needs-improvement';
      return 'poor';
    default:
      return norm || 'unknown';
  }
}

function sendToAnalytics(metric: any) {
  // 构建绝对URL，避免端口或基址不一致导致的上报失败
  const endpoint = typeof window !== 'undefined'
    ? `${window.location.origin}/api/vitals`
    : `/api/vitals`;

  try {
    // 发送到简单的API（开发/生产均可用）
    navigator.sendBeacon?.(
      endpoint,
      new Blob([JSON.stringify(metric)], { type: "application/json" })
    );
  } catch {
    // 回退到fetch
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(() => {});
  }
}

export default function WebVitalsReporter() {
  useEffect(() => {
    const wrap = (metric: any) => {
      const nav = typeof performance !== 'undefined'
        ? (performance.getEntriesByType('navigation')[0] as any)
        : undefined;
      const rating = getRating(metric.name, metric.value, metric.rating);
      const payload = {
        ...metric,
        rating,
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        navigationType: nav?.type,
        visibilityState: typeof document !== 'undefined' ? document.visibilityState : undefined,
        timestamp: new Date().toISOString(),
      };
      sendToAnalytics(payload);
    };
    onCLS(wrap);
    onLCP(wrap);
    onTTFB(wrap);
    onINP(wrap);
  }, []);

  return null;
}
