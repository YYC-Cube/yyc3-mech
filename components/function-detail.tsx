"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  Copy,
  ExternalLink,
  Info,
  Play,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSound } from "@/contexts/sound-context";

interface FunctionDetailProps {
  functionId: string;
  functionName: string;
  functionNameEn?: string;
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  codeExample: string;
  parameters?: {
    name: string;
    type: string;
    description: string;
    descriptionEn?: string;
    required: boolean;
  }[];
  onBack?: () => void;
}

export function FunctionDetail({
  functionId,
  functionName,
  functionNameEn,
  description,
  descriptionEn,
  category,
  categoryEn,
  codeExample,
  parameters = [],
  onBack,
}: FunctionDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const [copied, setCopied] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    playSound("click");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    playSound("success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (onBack) {
      playSound("click");
      onBack();
    }
  };

  // 根据当前语言获取标题和描述
  const title =
    language === "en" ? functionNameEn || functionName : functionName;
  const desc = language === "en" ? descriptionEn || description : description;
  const cat = language === "en" ? categoryEn || category : category;

  return (
    <div className="rounded-lg border border-[#25272E] bg-[#1F2127] overflow-hidden">
      {/* 顶部导航 */}
      <div className="border-b border-[#25272E] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#25272E] hover:bg-[#25272E] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs bg-[#FF6B3C]/20 text-[#FF6B3C] rounded-md">
            {cat}
          </span>
          <span className="px-2 py-1 text-xs bg-[#25272E] text-[#D0D5DE]/70 rounded-md">
            ID: {functionId}
          </span>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-[#25272E]">
        <div className="flex">
          <button
            className={`px-4 py-3 relative ${
              activeTab === "overview"
                ? "text-[#FF6B3C]"
                : "text-[#D0D5DE] hover:text-[#D0D5DE]/80"
            }`}
            onClick={() => handleTabChange("overview")}
          >
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>{t("概览", "Overview")}</span>
            </div>
            {activeTab === "overview" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B3C]"
                layoutId="activeTabIndicator"
              />
            )}
          </button>
          <button
            className={`px-4 py-3 relative ${
              activeTab === "parameters"
                ? "text-[#FF6B3C]"
                : "text-[#D0D5DE] hover:text-[#D0D5DE]/80"
            }`}
            onClick={() => handleTabChange("parameters")}
          >
            <div className="flex items-center gap-2">
              <Settings size={16} />
              <span>{t("参数", "Parameters")}</span>
            </div>
            {activeTab === "parameters" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B3C]"
                layoutId="activeTabIndicator"
              />
            )}
          </button>
          <button
            className={`px-4 py-3 relative ${
              activeTab === "code"
                ? "text-[#FF6B3C]"
                : "text-[#D0D5DE] hover:text-[#D0D5DE]/80"
            }`}
            onClick={() => handleTabChange("code")}
          >
            <div className="flex items-center gap-2">
              <Code size={16} />
              <span>{t("代码示例", "Code Example")}</span>
            </div>
            {activeTab === "code" && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B3C]"
                layoutId="activeTabIndicator"
              />
            )}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">
                {t("功能描述", "Description")}
              </h3>
              <p className="text-[#D0D5DE]/80 leading-relaxed">{desc}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                {t("使用场景", "Use Cases")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[#D0D5DE]/80">
                <li>
                  {t(
                    "在应用中实现高级功能",
                    "Implement advanced features in your application",
                  )}
                </li>
                <li>{t("与其他模块集成", "Integrate with other modules")}</li>
                <li>{t("自定义工作流程", "Customize workflows")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                {t("注意事项", "Notes")}
              </h3>
              <div className="p-4 border border-[#FF6B3C]/30 bg-[#FF6B3C]/10 rounded-md text-[#D0D5DE]/90">
                <p>
                  {t(
                    "使用此功能前，请确保您已了解相关参数和使用限制。",
                    "Before using this function, please make sure you understand the relevant parameters and usage limitations.",
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "parameters" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">
              {t("参数列表", "Parameter List")}
            </h3>

            {parameters.length === 0 ? (
              <p className="text-[#D0D5DE]/70">
                {t("此功能没有参数", "This function has no parameters")}
              </p>
            ) : (
              <div className="border border-[#25272E] rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#25272E]">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t("参数名", "Name")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("类型", "Type")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("必填", "Required")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("描述", "Description")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param, index) => (
                      <tr key={index} className="border-t border-[#25272E]">
                        <td className="px-4 py-3 font-mono text-sm">
                          {param.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-xs bg-[#25272E] rounded-md font-mono">
                            {param.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {param.required ? (
                            <span className="px-2 py-0.5 text-xs bg-[#FF6B3C]/20 text-[#FF6B3C] rounded-md">
                              {t("必填", "Required")}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs bg-[#25272E] text-[#D0D5DE]/70 rounded-md">
                              {t("可选", "Optional")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#D0D5DE]/80">
                          {language === "en"
                            ? param.descriptionEn || param.description
                            : param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "code" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {t("代码示例", "Code Example")}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-[#25272E] hover:bg-[#25272E] transition-colors"
                >
                  <Copy size={14} />
                  <span>
                    {copied ? t("已复制", "Copied") : t("复制", "Copy")}
                  </span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-[#25272E] hover:bg-[#25272E] transition-colors">
                  <ExternalLink size={14} />
                  <span>{t("在线运行", "Run Online")}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-[#25272E] rounded-md overflow-auto max-h-96 font-mono text-sm">
                <code>{codeExample}</code>
              </pre>
              <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md bg-[#FF6B3C] text-black hover:bg-[#FF8F6C] transition-colors">
                <Play size={16} />
              </button>
            </div>

            <div className="p-4 border border-[#25272E] rounded-md bg-[#25272E]/30">
              <h4 className="font-bold mb-2">{t("运行结果", "Result")}</h4>
              <p className="text-[#D0D5DE]/70 italic">
                {t(
                  "点击“在线运行”按钮查看代码执行结果",
                  'Click the "Run Online" button to see the code execution result',
                )}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
