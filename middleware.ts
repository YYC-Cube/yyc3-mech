import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 允许的源列表 - 根据环境配置
const getAllowedOrigins = () => {
  const origins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  // 在开发环境中允许 localhost
  if (process.env.NODE_ENV === 'development') {
    return [...origins, 'http://localhost:3000', 'http://localhost:3001'];
  }
  return origins;
};

export function middleware(request: NextRequest) {
  // 获取响应对象
  const response = NextResponse.next();

  // 安全的CORS配置 - 只允许特定的源
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  
  // 严格的源验证 - 只有在明确允许的情况下才设置 CORS 头
  if (origin && allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  // 添加安全头
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

// 配置中间件匹配的路径
export const config = {
  matcher: ["/api/:path*"],
};
