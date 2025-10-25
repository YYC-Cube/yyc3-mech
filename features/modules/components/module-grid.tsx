"use client";

import { useState } from "react";
import { ModuleCard } from "./module-card";
import { ModuleDetails } from "./module-details";
import { useSound } from "@/contexts/sound-context";
import { useNotification } from "@/contexts/notification-context";
import { useModuleStore } from "@/store/module-store";
import { handleError, safeFn } from "@/lib/error-handler";
import type { ModuleData } from "@/types/module";

interface ModuleGridProps {
  modules: ModuleData[];
  activeModule: string | null;
  onModuleClick: (id: string) => void;
}

export default function ModuleGrid({
  modules,
  activeModule,
  onModuleClick,
}: ModuleGridProps) {
  const [expandedModule, setExpandedModule] = useState<ModuleData | null>(null);
  const { playSound, isAudioSupported } = useSound();
  const { addNotification } = useNotification();
  const { toggleFavorite, rateModule } = useModuleStore();

  // 安全的音效播放函数
  const safePlaySound = safeFn(
    (type: string) => {
      if (isAudioSupported) {
        playSound(type);
      }
    },
    (error, metadata) => {
      handleError(error, {
        tags: ["module-grid", "play-sound"],
        metadata: { soundType: metadata },
        silent: true,
      });
    },
  );

  const handleModuleClick = (module: ModuleData) => {
    if (activeModule === module.id) {
      onModuleClick("");
      setExpandedModule(null);
      safePlaySound("close");
    } else {
      onModuleClick(module.id);
      setExpandedModule(module);
      safePlaySound("expand");

      // 显示模块选择通知
      addNotification({
        type: "info",
        title: "模块已选择",
        message: `您已选择 ${module.title} 模块`,
        duration: 3000,
      });
    }
  };

  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(id, isFavorite);

      // 显示收藏通知
      addNotification({
        type: "success",
        title: isFavorite ? "已添加收藏" : "已取消收藏",
        message: isFavorite ? "模块已添加到您的收藏" : "模块已从您的收藏中移除",
        duration: 2000,
      });
    } catch (error) {
      handleError(error, {
        tags: ["module-grid", "toggle-favorite"],
        showToUser: true,
      });
    }
  };

  const handleRateModule = async (id: string, rating: number) => {
    try {
      await rateModule(id, rating);

      // 显示评分通知
      addNotification({
        type: "success",
        title: "评分成功",
        message: `您已为此模块评分 ${rating} 星`,
        duration: 2000,
      });
    } catch (error) {
      handleError(error, {
        tags: ["module-grid", "rate-module"],
        showToUser: true,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isActive={activeModule === module.id}
            onClick={() => handleModuleClick(module)}
          />
        ))}
      </div>

      {expandedModule && (
        <ModuleDetails
          module={expandedModule}
          onClose={() => {
            setExpandedModule(null);
            onModuleClick("");
            safePlaySound("close");
          }}
          onFavoriteToggle={handleFavoriteToggle}
          onRate={handleRateModule}
        />
      )}
    </div>
  );
}
