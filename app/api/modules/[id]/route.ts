import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { mockModules } from "@/services/mock-data";
import { getValidatedModuleId } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    // 从URL获取参数并验证
    const validationResult = getValidatedModuleId(request.nextUrl.pathname);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 });
    }
    
    const id = validationResult.data;
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const module = mockModules.find((m) => m.id === id);

    if (!module) {
      return NextResponse.json({ error: "模块不存在" }, { status: 404 });
    }

    return NextResponse.json(module, { status: 200 });
  } catch (error) {
    console.error('获取模块详情失败:', error);
    return NextResponse.json({ error: "获取模块详情失败" }, { status: 500 });
  }
}

// 添加OPTIONS方法处理CORS预检请求
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  // 在开发环境允许 localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
  }
  
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  // 严格验证：只有在明确允许的情况下才设置 CORS 头
  if (origin && allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
