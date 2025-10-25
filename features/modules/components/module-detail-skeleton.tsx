"use client";

export default function ModuleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE]">
      {/* 顶部导航栏骨架 */}
      <header className="border-b border-[#25272E] bg-[#1A1C22]/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#25272E] animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25272E] animate-pulse"></div>
              <div className="w-24 h-6 bg-[#25272E] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 模块标题区域骨架 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-md bg-[#25272E] animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-[#25272E] rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-[#25272E] rounded animate-pulse"></div>
            </div>
          </div>

          {/* 机械装饰线骨架 */}
          <div className="h-1 w-full bg-[#25272E]"></div>
        </div>

        {/* 标签页导航骨架 */}
        <div className="mb-6 border-b border-[#25272E]">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-20 bg-[#25272E] rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* 内容区域骨架 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
              >
                <div className="h-6 w-40 bg-[#25272E] rounded mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#25272E] rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-[#25272E] rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-[#25272E] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-[#25272E] bg-[#1F2127] p-6"
              >
                <div className="h-6 w-32 bg-[#25272E] rounded mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#25272E] rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-[#25272E] rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-[#25272E] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#25272E] py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="h-4 w-48 bg-[#25272E] rounded mx-auto animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}
