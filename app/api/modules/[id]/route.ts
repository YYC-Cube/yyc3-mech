import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { mockModules } from "@/services/mock-data";

export async function GET(request: NextRequest) {
  try {
    // 从URL获取参数
    const id = request.nextUrl.pathname.split('/').pop() || '';
    
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
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
