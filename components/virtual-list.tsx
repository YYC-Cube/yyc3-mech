"use client";

import type React from "react";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  overscan?: number;
}

function VirtualListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  itemClassName,
  overscan = 3,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // 计算可见区域
  const totalHeight = items.length * itemHeight;
  const visibleStartIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan,
  );
  const visibleEndIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan,
  );

  // 获取可见项
  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleStartIndex + index;
          return (
            <div
              key={actualIndex}
              className={cn("absolute w-full", itemClassName)}
              style={{
                top: actualIndex * itemHeight,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 使用React.memo优化组件
export const VirtualList = memo(
  VirtualListComponent,
) as typeof VirtualListComponent;
