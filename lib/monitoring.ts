import * as Sentry from "@sentry/react";

let initialized = false;

export function setupMonitoring() {
  if (initialized) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  // 仅在浏览器端初始化，避免对服务端渲染产生影响
  if (typeof window !== "undefined" && dsn) {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      // 如果后续开启回放，可打开以下配置
      // replaysSessionSampleRate: 0.05,
      // replaysOnErrorSampleRate: 1.0,
      integrations: [],
      environment: process.env.NODE_ENV,
    });
    initialized = true;
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  try {
    Sentry.captureException(error, { extra: context });
  } catch {}
}
