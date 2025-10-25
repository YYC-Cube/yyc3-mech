// 环境变量配置
export const env = {
  // 基础URL，用于API请求等
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  // 是否为生产环境
  isProd: process.env.NODE_ENV === "production",
  // 是否为开发环境
  isDev: process.env.NODE_ENV === "development",
  // 是否为CI环境
  isCI: process.env.CI === "true",
  // API前缀
  apiPrefix: "/api",
  // 版本号
  version: "1.0.0",
};

// 导出一个获取完整API URL的辅助函数
export function getApiUrl(path: string): string {
  return `${env.apiPrefix}${path.startsWith("/") ? path : `/${path}`}`;
}
