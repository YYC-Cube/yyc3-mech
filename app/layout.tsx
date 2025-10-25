import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Temporarily disable providers for isolation
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { SoundProvider } from "@/contexts/sound-context";
import { NotificationProvider } from "@/contexts/notification-context";
// import { PreloadAssets } from "@/components/preload-assets";
// import MonitoringInit from "@/components/monitoring-init";
// import WebVitalsReporter from "@/components/web-vitals-reporter";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus AI - 机械风创新UI设计",
  description:
    "智能机械风创新UI设计全案，融合工业机械的精密感与智能科技的未来感",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/placeholder-logo.svg", type: "image/svg+xml" },
      { url: "/placeholder-logo.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
           <LanguageProvider>
              <SoundProvider>
                 <NotificationProvider>
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </NotificationProvider>
               </SoundProvider>
            </LanguageProvider>
         </ThemeProvider>
      </body>
    </html>
  );
}
