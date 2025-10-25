"use client";

import { motion } from "framer-motion";
import type { ModuleData } from "@/types/module";
import {
  getModuleCases,
  getModuleTestimonials,
} from "@/app/modules/[id]/utils";

export default function CasesTab({ module }: { module: ModuleData }) {
  return (
    <div className="space-y-8">
      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6">成功案例</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getModuleCases(module.id).map((caseItem, index) => (
            <motion.div
              key={index}
              className="border border-[#25272E] rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="h-40 bg-[#25272E] relative">
                <div className="absolute inset-0 flex items-center justify-center text-[#D0D5DE]/30 text-4xl">
                  {module.icon}
                </div>
                {/* 机械装饰元素 */}
                <div className="absolute top-2 right-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2V4"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 20V22"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.93 4.93L6.34 6.34"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.66 17.66L19.07 19.07"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H4"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 12H22"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.34 17.66L4.93 19.07"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.07 4.93L17.66 6.34"
                        stroke="#FF6B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#2A2D36]"></div>
                  <span className="text-sm font-medium">
                    {caseItem.company}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{caseItem.title}</h3>
                <p className="text-sm text-[#D0D5DE]/70 mb-4">
                  {caseItem.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D0D5DE]/50">{caseItem.industry}</span>
                  <span className="text-[#FF6B3C]">阅读详情 →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-6">客户评价</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getModuleTestimonials(module.id).map((testimonial, index) => (
            <motion.div
              key={index}
              className="border border-[#25272E] rounded-md p-4 bg-[#25272E]/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#2A2D36]"></div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-xs text-[#D0D5DE]/70">
                    {testimonial.position}
                  </p>
                </div>
              </div>
              <p className="text-sm italic">"{testimonial.content}"</p>
              <div className="mt-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={star <= testimonial.rating ? "#FF6B3C" : "none"}
                    stroke={star <= testimonial.rating ? "#FF6B3C" : "#D0D5DE"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 行业数据展示 */}
      <motion.div
        className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-6">行业数据</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#25272E] rounded-md p-4 bg-[#25272E]/20">
            <h3 className="text-sm text-[#D0D5DE]/70 mb-1">效率提升</h3>
            <div className="text-3xl font-bold text-[#FF6B3C]">300%</div>
            <p className="text-xs mt-2">
              相比传统方法，使用{module.title}后的平均效率提升
            </p>
          </div>

          <div className="border border-[#25272E] rounded-md p-4 bg-[#25272E]/20">
            <h3 className="text-sm text-[#D0D5DE]/70 mb-1">成本节约</h3>
            <div className="text-3xl font-bold text-[#00B4FF]">65%</div>
            <p className="text-xs mt-2">
              使用{module.title}可大幅降低人力和运营成本
            </p>
          </div>

          <div className="border border-[#25272E] rounded-md p-4 bg-[#25272E]/20">
            <h3 className="text-sm text-[#D0D5DE]/70 mb-1">用户满意度</h3>
            <div className="text-3xl font-bold text-[#FF6B3C]">92%</div>
            <p className="text-xs mt-2">
              客户使用{module.title}后的平均满意度评分
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
