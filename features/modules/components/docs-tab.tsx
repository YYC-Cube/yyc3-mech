"use client";

import { motion } from "framer-motion";
import type { ModuleData } from "@/types/module";

export default function DocsTab({ module }: { module: ModuleData }) {
  return (
    <motion.div
      className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6">文档</h2>
      <p className="text-[#D0D5DE]/70">暂无相关文档，敬请期待...</p>
    </motion.div>
  );
}
