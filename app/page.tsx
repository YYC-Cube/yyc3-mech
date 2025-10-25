"use client"

import React, { Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, Settings, Terminal, HelpCircle, Bell, TestTube } from "lucide-react"
import { useSound } from "@/contexts/sound-context"
import { useLanguage } from "@/contexts/language-context"
import { useNotification } from "@/contexts/notification-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/ui/loading"
import { useModuleStore } from "@/store/module-store"
import { useUIStore } from "@/store/ui-store"
import { handleError, safeFn } from "@/lib/error-handler"

// 动态导入组件（改为容器入口）
const ModuleGrid = React.lazy(() =>
  import("@/features/modules/containers").then((mod) => ({ default: mod.ModuleGridContainer })),
)
const LanguageSwitcher = React.lazy(() =>
  import("@/components/language-switcher").then((mod) => ({ default: mod.LanguageSwitcher })),
)
const NavButton = React.lazy(() => import("@/components/nav-button").then((mod) => ({ default: mod.NavButton })))

export default function HomePage() {
  return (
    <ErrorBoundary>
      <HomePageContent />
    </ErrorBoundary>
  )
}

function HomePageContent() {
  // 使用状态管理
  const { modules, activeModule, loading, error, fetchModules, setActiveModule } = useModuleStore()
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()

  const { language, t } = useLanguage()
  const { playSound, isAudioSupported } = useSound()
  const { addNotification } = useNotification()

  // 加载模块数据
  useEffect(() => {
    fetchModules().catch((error) => {
      handleError(error, {
        tags: ["home-page", "fetch-modules"],
        showToUser: true,
      })
    })
  }, [fetchModules])

  // 安全地播放音效的函数
  const safePlaySound = safeFn(
    (type: string) => {
      if (isAudioSupported) {
        playSound(type)
      }
    },
    (error) => {
      console.warn(`播放音效失败:`, error)
    },
  )

  // 显示欢迎通知
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: "info",
        title: t("欢迎使用 Nexus AI", "Welcome to Nexus AI"),
        message: t(
          "探索我们的机械风格UI设计，体验智能科技与工业美学的完美融合。",
          "Explore our mechanical style UI design, experience the perfect fusion of intelligent technology and industrial aesthetics.",
        ),
        duration: 5000,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [addNotification, t])

  return (
    <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE] flex flex-col">
      <header className="border-b border-[#25272E] bg-gradient-to-b from-[#1F2127] to-[#1A1C22] backdrop-blur-sm sticky top-0 z-50 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V3M12 21v-2M5 12H3M21 12h-2M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636M18.364 5.636l-1.414 1.414M7.05 16.95l-1.414 1.414"
                      stroke="#FF6B3C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" fill="#00B4FF" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#D0D5DE] to-[#A0A5AE] bg-clip-text text-transparent">
                Nexus AI
              </h1>
            </div>

            {/* 桌面导航菜单 */}
            <nav className="hidden md:flex items-center gap-3">
              <Suspense fallback={<Loading size="sm" />}>
                  <NavButton icon={<Terminal size={16} />} label={t("控制中心", "Control Center")} />
                  <NavButton icon={<Settings size={16} />} label={t("系统设置", "System Settings")} />
                  <NavButton icon={<TestTube size={16} />} label={t("测试修复", "Test Fixer")} href="/test-fixer" />
                  <NavButton icon={<HelpCircle size={16} />} label={t("帮助文档", "Help Docs")} />
                  <NavButton icon={<Bell size={16} />} label={t("消息通知", "Notifications")} />
                  <div className="ml-2 flex items-center gap-2">
                    <LanguageSwitcher />
                    <SoundControl />
                  </div>
                </Suspense>
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              aria-label="打开菜单"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md border border-[#25272E] bg-[#25272E]/50 hover:bg-[#25272E] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
              onClick={() => {
                toggleMobileMenu()
                safePlaySound("click")
              }}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* 移动端下拉菜单 */}
          <motion.div
            className="md:hidden overflow-hidden mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: mobileMenuOpen ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileMenuOpen && (
              <div className="py-3 space-y-2 border-t border-[#25272E] mt-3">
                <Suspense fallback={<Loading size="sm" />}>
                  <NavButton icon={<Terminal size={16} />} label={t("控制中心", "Control Center")} fullWidth />
                  <NavButton icon={<Settings size={16} />} label={t("系统设置", "System Settings")} fullWidth />
                  <NavButton icon={<TestTube size={16} />} label={t("测试修复", "Test Fixer")} href="/test-fixer" fullWidth />
                  <NavButton icon={<HelpCircle size={16} />} label={t("帮助文档", "Help Docs")} fullWidth />
                  <NavButton icon={<Bell size={16} />} label={t("消息通知", "Notifications")} fullWidth />
                  <div className="pt-2 flex justify-center gap-2">
                    <LanguageSwitcher />
                    <SoundControl />
                  </div>
                </Suspense>
              </div>
            )}
          </motion.div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="inline-block w-6 h-6 mr-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14M6 18C4.89543 18 4 17.1046 4 16C4 14.8954 4.89543 14 6 14M6 18V20M6 14V4M12 10V20M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14M18 18C16.8954 18 16 17.1046 16 16C16 14.8954 16.8954 14 18 14M18 18V20M18 14V4"
                stroke="#FF6B3C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {t("功能模块控制中心", "Function Module Control Center")}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading variant="gear" size="lg" text={t("加载模块中...", "Loading modules...")} />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-[#FF4444]/30 bg-[#FF4444]/10 p-6 text-center">
            <div className="text-[#FF4444] text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">{t("加载失败", "Loading Failed")}</h3>
            <p className="text-[#D0D5DE]/70 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors"
            >
              {t("重新加载", "Reload")}
            </button>
          </div>
        ) : (
          <Suspense fallback={<Loading variant="gear" text={t("准备模块...", "Preparing modules...")} />}>
            <ModuleGrid modules={modules} onModuleClick={setActiveModule} activeModule={activeModule} />
          </Suspense>
        )}
      </main>

      <footer className="border-t border-[#25272E] py-6">
        <div className="container mx-auto px-4 text-center text-sm text-[#D0D5DE]/60">
          <p>
            {t(
              "© 2025 Nexus AI 智能机械风创新UI设计. 保留所有权利.",
              "© 2025 Nexus AI Mechanical Innovation UI Design. All rights reserved.",
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}

// 音效控制组件 - 使用React.memo优化
const SoundControl = React.memo(function SoundControl() {
  const { isMuted, toggleMute, openSoundSettings, isAudioSupported } = useSound()
  const { t } = useLanguage()
  const { addNotification } = useNotification()

  // 安全地调用函数
  const safeToggleMute = () => {
    try {
      toggleMute()
      
      // 显示通知
      addNotification({
        type: "info",
        title: t("音效设置", "Sound Settings"),
        message: isMuted 
          ? t("音效已开启", "Sound effects enabled") 
          : t("音效已关闭", "Sound effects disabled"),
        duration: 2000
      })
    } catch (error) {
      handleError(error, {
        tags: ["sound-control", "toggle-mute"],
        showToUser: true
      })
    }
  }

  const safeOpenSettings = () => {
    try {
      openSoundSettings()
    } catch (error) {
      handleError(error, {
        tags: ["sound-control", "open-settings"],
        showToUser: true
      })
    }
  }

  // 如果音频不受支持，显示禁用状态
  if (!isAudioSupported) {
    return (
      <div className="flex items-center gap-2">
        <button
          disabled
          className="w-10 h-10 flex items-center justify-center rounded-md border border-[#25272E] bg-[#25272E]/30 text-[#D0D5DE]/50 cursor-not-allowed"
          title={t("音频不受支持", "Audio not supported")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M23 9L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 9L23 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={safeToggleMute}
        className="w-10 h-10 flex items-center justify-center rounded-md border border-[#25272E] bg-[#25272E]/50 hover:bg-[#25272E] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        title={isMuted ? t("开启音效", "Enable Sound") : t("关闭音效", "Disable Sound")}
      >
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="#D0D5DE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M23 9L17 15" stroke="#D0D5DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 9L23 15" stroke="#D0D5DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="#D0D5DE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93C20.9447 6.80528 21.9979 9.34472 21.9979 12C21.9979 14.6553 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39763 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54"
              stroke="#D0D5DE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <button
        onClick={safeOpenSettings}
        className="w-10 h-10 flex items-center justify-center rounded-md border border-[#25272E] bg-[#25272E]/50 hover:bg-[#25272E] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        title={t("音效设置", "Sound Settings")}
      >
        <Settings size={16} className="text-[#D0D5DE]" />
      </button>
    </div>
  )
})
