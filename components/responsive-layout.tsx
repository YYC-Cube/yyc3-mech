"use client";

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// 定义断点
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = keyof typeof breakpoints;

// 响应式布局组件
interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveLayout({
  children,
  className,
}: ResponsiveLayoutProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint("xs");
      }
    };

    // 初始化
    updateBreakpoint();

    // 监听窗口大小变化
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  return (
    <div
      className={cn("transition-all duration-300", className)}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  );
}

// 响应式组件
interface ResponsiveComponentProps {
  children: ReactNode;
  breakpoints: {
    xs?: ReactNode;
    sm?: ReactNode;
    md?: ReactNode;
    lg?: ReactNode;
    xl?: ReactNode;
    "2xl"?: ReactNode;
  };
}

export function ResponsiveComponent({
  children,
  breakpoints: breakpointComponents,
}: ResponsiveComponentProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint("xs");
      }
    };

    // 初始化
    updateBreakpoint();

    // 监听窗口大小变化
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  // 根据当前断点渲染对应组件
  const componentToRender = (() => {
    // 从当前断点开始，向下查找可用组件
    if (breakpointComponents[currentBreakpoint]) {
      return breakpointComponents[currentBreakpoint];
    }

    const breakpointOrder: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

    // 向下查找
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (breakpointComponents[bp]) {
        return breakpointComponents[bp];
      }
    }

    // 向上查找
    for (let i = currentIndex - 1; i >= 0; i--) {
      const bp = breakpointOrder[i];
      if (breakpointComponents[bp]) {
        return breakpointComponents[bp];
      }
    }

    // 默认返回children
    return children;
  })();

  return <>{componentToRender}</>;
}

// 自定义Hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    };

    // 初始化
    updateBreakpoint();

    // 监听窗口大小变化
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  return breakpoint;
}

// 便捷的媒体查询Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);

      const updateMatches = () => {
        setMatches(media.matches);
      };

      // 初始化
      updateMatches();

      // 监听变化
      media.addEventListener("change", updateMatches);

      return () => {
        media.removeEventListener("change", updateMatches);
      };
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
