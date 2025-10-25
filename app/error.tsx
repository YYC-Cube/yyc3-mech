"use client";

import { useEffect } from "react";
import { errorLogger } from "@/lib/error-logger";
import { useLanguage } from "@/contexts/language-context";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // 记录错误到错误日志系统
    errorLogger.logError(error, {
      severity: "critical",
      tags: ["global-error"],
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE] flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-lg border border-[#25272E] bg-[#1F2127]">
            <div className="text-[#FF4444] text-4xl mb-4 text-center">⚠️</div>
            <h1 className="text-2xl font-bold mb-4 text-center">
              {t("系统错误", "System Error")}
            </h1>
            <p className="text-[#D0D5DE]/70 mb-6 text-center">
              {t(
                "应用程序遇到了意外错误。我们已记录此问题并将尽快修复。",
                "The application encountered an unexpected error. We have logged this issue and will fix it as soon as possible.",
              )}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors"
              >
                {t("重试", "Try Again")}
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
