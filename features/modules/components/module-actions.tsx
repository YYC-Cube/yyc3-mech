"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Share2, Star } from "lucide-react";
import { useSound } from "@/contexts/sound-context";
import {
  rateModule,
  shareModule,
  toggleFavoriteModule,
} from "@/services/module-service";

interface ModuleActionsProps {
  moduleId: string;
  isFavorite: boolean;
  rating: number;
  userRating: number;
  className?: string;
}

export function ModuleActions({
  moduleId,
  isFavorite,
  rating,
  userRating,
  className = "",
}: ModuleActionsProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [currentRating, setCurrentRating] = useState(userRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { playSound } = useSound();

  // 处理收藏点击
  const handleFavoriteClick = async () => {
    playSound("click");
    const newState = !favorite;
    try {
      setFavorite(newState);
      await toggleFavoriteModule(moduleId, newState);
    } catch (e) {
      // TODO: 错误处理，可用 toast 或日志
    }
  };

  // 处理评分
  const handleRatingClick = async (value: number) => {
    playSound("click");
    try {
      setCurrentRating(value);
      await rateModule(moduleId, value);
    } catch (e) {
      // TODO: 错误处理
    }
  };

  // 处理分享
  const handleShareClick = () => {
    playSound("click");
    setIsShareOpen(!isShareOpen);
  };

  // 处理特定平台分享
  const handleShareToPlatform = async (platform: string) => {
    playSound("click");
    try {
      const result = await shareModule(moduleId, platform);
      if (result.url) {
        // 在实际应用中，这里可能会复制链接到剪贴板或打开分享对话框
        console.log(`分享到 ${platform}，链接: ${result.url}`);

        // 模拟复制到剪贴板
        navigator.clipboard.writeText(result.url).then(() => {
          alert(`链接已复制到剪贴板: ${result.url}`);
        });
      }
      setIsShareOpen(false);
    } catch (e) {
      // TODO: 错误处理
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 收藏按钮 */}
      <motion.button
        className={`flex items-center justify-center w-10 h-10 rounded-full border ${
          favorite
            ? "border-[#FF6B3C] bg-[#FF6B3C]/10"
            : "border-[#25272E] hover:bg-[#25272E]/50"
        } transition-colors`}
        whileTap={{ scale: 0.9 }}
        onClick={handleFavoriteClick}
        title={favorite ? "取消收藏" : "收藏"}
      >
        <Bookmark
          size={18}
          className={
            favorite ? "fill-[#FF6B3C] text-[#FF6B3C]" : "text-[#D0D5DE]"
          }
        />
      </motion.button>

      {/* 评分 */}
      <div className="relative">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#25272E] hover:bg-[#25272E]/50 transition-colors"
          whileTap={{ scale: 0.9 }}
          onClick={() => setHoverRating(currentRating > 0 ? currentRating : 0)}
          onMouseEnter={() =>
            setHoverRating(currentRating > 0 ? currentRating : 0)
          }
          onMouseLeave={() => setHoverRating(0)}
          title="评分"
        >
          <Star
            size={18}
            className={
              currentRating > 0
                ? "fill-[#FF6B3C] text-[#FF6B3C]"
                : "text-[#D0D5DE]"
            }
          />
        </motion.button>

        {/* 评分弹出框 */}
        {hoverRating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#1F2127] border border-[#25272E] rounded-md p-2 shadow-lg z-10"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  className="p-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoverRating(value)}
                  onClick={() => handleRatingClick(value)}
                >
                  <Star
                    size={20}
                    className={`${
                      value <= hoverRating
                        ? "fill-[#FF6B3C] text-[#FF6B3C]"
                        : "text-[#D0D5DE]"
                    } transition-colors`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 分享按钮 */}
      <div className="relative">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#25272E] hover:bg-[#25272E]/50 transition-colors"
          whileTap={{ scale: 0.9 }}
          onClick={handleShareClick}
          title="分享"
        >
          <Share2 size={18} className="text-[#D0D5DE]" />
        </motion.button>

        {/* 分享弹出框 */}
        {isShareOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 bg-[#1F2127] border border-[#25272E] rounded-md p-2 shadow-lg z-10 w-48"
          >
            <div className="space-y-1">
              {["微信", "微博", "QQ", "钉钉", "复制链接"].map((platform) => (
                <button
                  key={platform}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[#25272E] transition-colors"
                  onClick={() => handleShareToPlatform(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 平均评分显示 */}
      <div className="flex items-center ml-2">
        <Star size={16} className="fill-[#FF6B3C] text-[#FF6B3C]" />
        <span className="text-sm ml-1">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}
