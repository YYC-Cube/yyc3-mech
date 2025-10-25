"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { LoadingSpinner } from "./loading-spinner";

interface DataPoint {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface DataDashboardProps {
  title: string;
  data?: DataPoint[];
  loading?: boolean;
  error?: string;
  className?: string;
}

export function DataDashboard({
  title,
  data = [],
  loading = false,
  error,
  className = "",
}: DataDashboardProps) {
  const { t } = useLanguage();
  const [animatedData, setAnimatedData] = useState<DataPoint[]>(
    data.map((d) => ({ ...d, value: 0 })),
  );

  useEffect(() => {
    if (!loading && data.length > 0) {
      // 动画效果：数值从0增长到目标值
      const timeout = setTimeout(() => {
        setAnimatedData(data);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [data, loading]);

  return (
    <div
      className={`rounded-lg border border-[#25272E] bg-[#1F2127] p-6 ${className}`}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <span className="inline-block w-6 h-6 mr-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21H3M21 21V3M21 21L12 12L9 15L3 9"
              stroke="#FF6B3C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {title}
      </h2>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center text-[#FF4444]">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animatedData.map((item, index) => (
            <motion.div
              key={index}
              className="border border-[#25272E] rounded-md p-4 bg-[#25272E]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon && <div className="text-xl">{item.icon}</div>}
                <h3 className="text-sm text-[#D0D5DE]/70">{item.label}</h3>
              </div>
              <div
                className={`text-3xl font-bold`}
                style={{ color: item.color }}
              >
                {Math.round(item.value)}
                {item.value > 0 && item.value < 100 && "%"}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
