import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { mockModules } from "@/services/mock-data";
import { z } from 'zod';

// 定义模块ID验证模式
const moduleIdSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);

export async function GET(request: NextRequest) {
  try {
    // 从URL获取参数并验证
    const id = request.nextUrl.pathname.split('/').filter(Boolean).pop() || '';
    
    const idValidation = moduleIdSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json({ error: "无效的模块ID" }, { status: 400 });
    }
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const module = mockModules.find((m) => m.id === idValidation.data);

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
  
  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.length === 0)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
