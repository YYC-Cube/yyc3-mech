"use client";

import { useEffect } from "react";

// 预加载音效文件列表
const soundFiles = [
  "/sounds/mechanical-click.mp3",
  "/sounds/mechanical-expand.mp3",
  "/sounds/mechanical-close.mp3",
  "/sounds/mechanical-hover.mp3",
  "/sounds/mechanical-success.mp3",
  "/sounds/mechanical-error.mp3",
  "/sounds/mechanical-notification.mp3",
  "/sounds/mechanical-startup.mp3",
  "/sounds/mechanical-shutdown.mp3",
  "/sounds/mechanical-toggle.mp3",
  "/sounds/mechanical-slide.mp3",
  "/sounds/mechanical-gear.mp3",
  "/sounds/fallback-sound.mp3",
];

export function PreloadAssets() {
  useEffect(() => {
    // 预加载音效
    soundFiles.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      // 设置为预加载但不播放
      audio.preload = "auto";
      audio.load();
    });

    // 预加载图片和其他资源
    const preloadImages: string[] = [
      // 添加需要预加载的图片
    ];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
