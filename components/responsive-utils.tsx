"use client";

import type React from "react";

import { useEffect, useState } from "react";

// 响应式断点
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// 使用媒体查询的Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      const listener = () => setMatches(media.matches);

      // 初始化
      setMatches(media.matches);

      // 添加监听器
      media.addEventListener("change", listener);

      // 清理
      return () => media.removeEventListener("change", listener);
    }
    return undefined;
  }, [query]);

  return matches;
}

// 常用的响应式Hook
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
}

export function useIsTablet() {
  return useMediaQuery(
    `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  );
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
}

// 动态加载组件
export function withResponsive<P extends object>(
  Component: React.ComponentType<P>,
  MobileComponent?: React.ComponentType<P>,
): React.FC<P> {
  return (props: P) => {
    const isMobile = useIsMobile();

    if (isMobile && MobileComponent) {
      return <MobileComponent {...props} />;
    }

    return <Component {...props} />;
  };
}
