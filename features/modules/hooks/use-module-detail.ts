"use client";

import { useState, useEffect } from "react";
import { useSound } from "@/contexts/sound-context";
import { rateModule, toggleFavoriteModule } from "@/services/module-service";
import { handleError } from "@/lib/error-handler";

interface UseModuleDetailParams {
  id: string;
  initialFavorite: boolean;
  initialUserRating: number;
}

export function useModuleDetailInteractions({
  id,
  initialFavorite,
  initialUserRating,
}: UseModuleDetailParams) {
  const { playSound } = useSound();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // 页面启动音效（如需在容器中控制，可移除）
    playSound("startup");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFavoriteToggle = async () => {
    setLoading(true);
    try {
      await toggleFavoriteModule(id, !isFavorite);
      setIsFavorite(!isFavorite);
      playSound(isFavorite ? "unfavorite" : "favorite");
    } catch (error) {
      handleError(error, {
        tags: ["module-detail", "toggle-favorite"],
        metadata: { id, nextState: !isFavorite },
        showToUser: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    setLoading(true);
    try {
      await rateModule(id, rating);
      setUserRating(rating);
      playSound("rate");
    } catch (error) {
      handleError(error, {
        tags: ["module-detail", "rate-module"],
        metadata: { id, rating },
        showToUser: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const url = window.location.href;
      setShareUrl(url);
      setIsShareModalOpen(true);
      playSound("share");
    } catch (error) {
      handleError(error, {
        tags: ["module-detail", "share"],
        metadata: { id },
        showToUser: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isFavorite,
    userRating,
    isShareModalOpen,
    shareUrl,
    setIsShareModalOpen,
    handleFavoriteToggle,
    handleRate,
    handleShare,
  };
}
