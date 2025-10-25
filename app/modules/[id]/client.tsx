"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Info,
  Settings,
  Share2,
  Star,
  Terminal,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSound } from "@/contexts/sound-context";
import { useLanguage } from "@/contexts/language-context";
import type { ModuleData } from "@/types/module";

import { CasesTab, DocsTab } from "@/features/modules/components";
import {
  getModuleAdvantages,
  getModulePurpose,
  getModuleSpecs,
  getModuleUserType,
} from "./utils";
import { useModuleDetailInteractions } from "@/features/modules/hooks";

// 用户交互按钮组件
function UserInteractionButtons({
  isFavorite,
  userRating,
  onFavoriteToggle,
  onRate,
  onShare,
  compact = false,
}: {
  isFavorite: boolean;
  userRating: number;
  onFavoriteToggle: () => void;
  onRate: (rating: number) => void;
  onShare: () => void;
  compact?: boolean;
}) {
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  return (
    <>
      <button
        onClick={onFavoriteToggle}
        className={`flex items-center justify-center ${compact ? "w-8 h-8" : "w-9 h-9"} rounded-full border transition-colors ${isFavorite
          ? "border-[#FF6B3C] bg-[#FF6B3C]/10 text-[#FF6B3C]"
          : "border-[#25272E] hover:bg-[#25272E] text-[#D0D5DE]"}
        `}
        title="收藏"
      >
        <Heart size={16} fill={isFavorite ? "#FF6B3C" : "none"} />
      </button>

      <div className="relative">
        <button
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className={`flex items-center justify-center ${compact ? "w-8 h-8" : "w-9 h-9"} rounded-full border transition-colors ${userRating > 0
            ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
            : "border-[#25272E] hover:bg-[#25272E] text-[#D0D5DE]"}
          `}
          title="评分"
        >
          <Star size={16} fill={userRating > 0 ? "#FFD700" : "none"} />
        </button>

        <AnimatePresence>
          {isRatingOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-[#1A1C22] border border-[#25272E] rounded-md p-2 shadow-lg w-32"
            >
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      onRate(star);
                      setIsRatingOpen(false);
                    }}
                    className="p-1 hover:bg-[#25272E] rounded transition-colors"
                  >
                    <Star
                      size={16}
                      fill={star <= userRating ? "#FFD700" : "none"}
                      stroke={star <= userRating ? "#FFD700" : "#D0D5DE"}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onShare}
        className={`flex items-center justify-center ${compact ? "w-8 h-8" : "w-9 h-9"} rounded-full border border-[#25272E] hover:bg-[#25272E] text-[#D0D5DE] transition-colors`}
        title="分享"
      >
        <Share2 size={16} />
      </button>
    </>
  );
}

// 标签按钮组件
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${active
        ? "border-[#FF6B3C] text-[#D0D5DE]"
        : "border-transparent text-[#D0D5DE]/60 hover:text-[#D0D5DE] hover:border-[#D0D5DE]/30"}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// 概览标签页内容
function OverviewTab({ module }: { module: ModuleData }) {
  const { language, t } = useLanguage();
  const description = module.description;
  const advantages = getModuleAdvantages(module.id);
  const purpose = getModulePurpose(module.id);
  const specs = getModuleSpecs(module.id);
  const userType = getModuleUserType(module.id);

  return (
    <div className="space-y-8">
      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6">{t("模块概览", "Module Overview")}</h2>
        <p className="text-[#D0D5DE]/80 leading-relaxed">{description}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Star className="text-[#FFD700]" size={20} />
            {t("核心优势", "Core Advantages")}
          </h2>
          <ul className="space-y-4">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-[#FF6B3C]/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B3C]"></div>
                </div>
                <span className="text-[#D0D5DE]/80">{advantage}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Info className="text-[#4E9FFF]" size={20} />
            {t("适用场景", "Use Cases")}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-[#D0D5DE]/90 font-medium mb-2">{t("主要用途", "Primary Purpose")}</h3>
              <p className="text-[#D0D5DE]/80">{purpose}</p>
            </div>
            <div>
              <h3 className="text-[#D0D5DE]/90 font-medium mb-2">{t("适用人群", "Target Users")}</h3>
              <p className="text-[#D0D5DE]/80">{userType}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="text-[#98D85B]" size={20} />
            {t("技术规格", "Technical Specifications")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {specs.map((spec, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="text-[#D0D5DE]/90 font-medium">{spec.name}</h3>
          <p className="text-[#D0D5DE]/80">{spec.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 功能标签页内容
function FeaturesTab({ module }: { module: ModuleData }) {
  const { language, t } = useLanguage();

  // 获取功能列表
  const features = module.features;

  return (
    <div className="space-y-8">
      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6">{t("功能详情", "Feature Details")}</h2>

        <div className="space-y-6">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={index}
              className="border border-[#25272E] rounded-lg p-4 bg-[#25272E]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-[#D0D5DE]/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-6">{t("操作指南", "User Guide")}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">{t("如何开始", "Getting Started")}</h3>
            <p className="text-[#D0D5DE]/80 mb-4">
              {t(
                "点击页面右侧的'立即使用'按钮，按照指引完成初始设置。",
                "Click the 'Use Now' button on the right side of the page and follow the instructions to complete the initial setup.",
              )}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">{t("常见问题", "FAQ")}</h3>
            <p className="text-[#D0D5DE]/80">
              {t(
                "如有任何疑问，请查看文档标签页或联系我们的技术支持团队。",
                "If you have any questions, please check the Docs tab or contact our technical support team.",
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 分享模态框
function ShareModal({
  isOpen,
  url,
  onClose,
}: {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1A1C22] border border-[#25272E] rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t("分享模块", "Share Module")}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#25272E] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 bg-[#1F2127] border border-[#25272E] rounded-l-md px-4 py-2 text-[#D0D5DE] focus:outline-none focus:ring-2 focus:ring-[#FF6B3C]/50"
              />
              <button
                onClick={copyToClipboard}
                className="bg-[#FF6B3C] hover:bg-[#FF6B3C]/90 text-white font-medium px-4 py-2 rounded-r-md transition-colors"
              >
                {copied ? t("已复制", "Copied") : t("复制", "Copy")}
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[#D0D5DE]/90 font-medium mb-2">{t("分享到", "Share to")}</h3>
              <div className="flex gap-3">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25272E] hover:bg-[#25272E]/70 transition-colors"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 4.01C21.1275 4.39034 20.1866 4.60254 19.21 4.64C19.6924 4.27259 20.0717 3.81064 20.3268 3.28533C19.6051 3.67237 18.8032 3.94196 17.96 3.99C17.3495 3.53227 16.5802 3.22159 15.76 3.11C15.0733 3.63091 14.6399 4.36211 14.54 5.15C12.8224 5.03494 11.1306 4.52141 9.6 3.67C9.17312 4.11991 8.88331 4.66078 8.76 5.23C7.35 5.07 5.95 4.69 4.65 4.11C4.17331 4.74078 3.89044 5.48988 3.84 6.28C3.84 6.3 38.4 6.3 3.84 6.28C5.74 7.21 7.92 7.75 10.14 7.8C9.68993 7.99163 9.27264 8.21251 8.91 8.46C8.55496 8.20335 8.20335 7.95504 7.88 7.73C7.5629 8.26441 7.37525 8.86175 7.34 9.47C7.34 9.49 7.34 9.51 7.34 9.53C9.02 10.71 11.06 11.38 13.18 11.42C12.64 11.61 12.07 11.71 11.49 11.71C11.17 11.71 10.85 11.69 10.54 11.64C11.26 12.56 12.34 13.27 13.57 13.32C12.66 14.21 11.43 14.82 10.1 14.82C9.77 14.82 9.45 14.8 9.13 14.76C10.41 15.76 11.99 16.37 13.68 16.37C17.91 16.37 21.54 13.28 21.54 8.76C21.54 8.56 21.54 8.36 21.53 8.16C22.34 7.36 23.03 6.4 23.55 5.32C22.8 5.61 22 5.83 21.12 5.96C21.83 5.45 22.4 4.74 22.76 3.88C22.09 4.28 21.34 4.54 20.56 4.65C20.56 4.66 20.56 4.67 20.56 4.67C20.57 4.67 20.57 4.67 20.57 4.67C21.41 4.64 22.23 4.43 23 4.07C22.23 4.46 21.37 4.69 20.48 4.75C20.48 4.75 20.48 4.75 20.48 4.75C20.48 4.76 20.48 4.76 20.48 4.76C21.28 4.79 22.06 4.58 22.78 4.15C22.07 4.5 21.28 4.71 20.45 4.77C20.45 4.77 20.45 4.77 20.45 4.77C20.45 4.77 20.45 4.77 20.45 4.77C21.2 4.8 21.93 4.61 22.6 4.22C21.95 4.53 21.2 4.73 20.4 4.79C20.4 4.79 20.4 4.79 20.4 4.79C20.4 4.79 20.4 4.79 20.4 4.79Z"
                      fill="#D0D5DE"
                    />
                  </svg>
                </button>
                
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25272E] hover:bg-[#25272E]/70 transition-colors"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                      fill="#D0D5DE"
                    />
                    <path d="M6 9H2V21H6V9Z" fill="#D0D5DE" />
                    <path
                      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                      fill="#D0D5DE"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 客户端组件部分
function ModuleDetailPageClient({
  initialData,
  id 
}: { 
  initialData: {
    module: ModuleData;
    isFavorite: boolean;
    userRating: number;
  };
  id: string;
}) {
  const router = useRouter();
  const { playSound } = useSound();
  const { language, t } = useLanguage();
  
  // 直接使用服务端传递的初始数据，不再需要额外的数据加载逻辑
  const [module, setModule] = useState<ModuleData>(initialData.module);
  const [activeTab, setActiveTab] = useState("overview");
  const {
    isFavorite,
    userRating,
    isShareModalOpen,
    shareUrl,
    setIsShareModalOpen,
    handleFavoriteToggle,
    handleRate,
    handleShare,
  } = useModuleDetailInteractions({
    id,
    initialFavorite: initialData.isFavorite,
    initialUserRating: initialData.userRating,
  });



  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    playSound("tab_switch");
  };

  const handleBack = () => {
    playSound("back");
    router.back();
  };



  return (
    <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE]">
      {/* 顶部导航栏 */}
      <header className="border-b border-[#25272E] bg-[#1A1C22]/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#25272E] bg-[#1A1C22] hover:bg-[#25272E] transition-colors"
              title="返回"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25272E] flex items-center justify-center">
                <Terminal size={16} className="text-[#FF6B3C]" />
              </div>
              <span className="font-medium">Nexus AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <UserInteractionButtons
              isFavorite={isFavorite}
              userRating={userRating}
              onFavoriteToggle={handleFavoriteToggle}
              onRate={handleRate}
              onShare={handleShare}
              compact
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 模块标题区域 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-md bg-[#25272E] flex items-center justify-center">
              <Terminal size={32} className="text-[#FF6B3C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {module.title}
              </h1>
              <p className="text-[#D0D5DE]/70">
                未分类
              </p>
            </div>
          </div>

          {/* 机械装饰线 */}
          <div className="h-1 w-full bg-gradient-to-r from-[#25272E] via-[#FF6B3C] to-[#25272E]"></div>
        </motion.div>

        {/* 标签页导航 */}
        <div className="mb-6 border-b border-[#25272E]">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => handleTabChange("overview")}
              icon={<Info size={16} />}
              label={t("概览", "Overview")}
            />
            <TabButton
              active={activeTab === "features"}
              onClick={() => handleTabChange("features")}
              icon={<Settings size={16} />}
              label={t("功能", "Features")}
            />
            <TabButton
              active={activeTab === "cases"}
              onClick={() => handleTabChange("cases")}
              icon={<Users size={16} />}
              label={t("案例", "Cases")}
            />
            <TabButton
              active={activeTab === "docs"}
              onClick={() => handleTabChange("docs")}
              icon={<ExternalLink size={16} />}
              label={t("文档", "Docs")}
            />
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="min-h-[60vh]">
          {activeTab === "overview" && <OverviewTab module={module} />}
          {activeTab === "features" && <FeaturesTab module={module} />}
          {activeTab === "cases" && <CasesTab module={module} />}
          {activeTab === "docs" && <DocsTab module={module} />}
        </div>
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

      {/* 分享模态框 */}
      <ShareModal
        isOpen={isShareModalOpen}
        url={shareUrl}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default ModuleDetailPageClient;