import { NextResponse } from "next/server";
import { mockModules } from "@/services/mock-data";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    // 解析查询参数
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    
    // 定义查询参数验证模式
    const queryParamsSchema = z.object({
      limit: z.string().optional().transform(limit => limit ? parseInt(limit) : undefined),
      page: z.string().optional().transform(page => page ? parseInt(page) : undefined),
      filter: z.string().optional()
    });
    
    // 验证查询参数
    const queryParams = queryParamsSchema.parse(Object.fromEntries(searchParams));
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // 根据查询参数过滤数据
    let filteredModules = [...mockModules];
    
    if (queryParams.filter) {
      const filter = queryParams.filter.toLowerCase();
      filteredModules = filteredModules.filter(module => 
        module.title.toLowerCase().includes(filter) || 
        module.description.toLowerCase().includes(filter)
      );
    }
    
    // 处理分页
    if (queryParams.limit && queryParams.page) {
      const startIndex = (queryParams.page - 1) * queryParams.limit;
      filteredModules = filteredModules.slice(startIndex, startIndex + queryParams.limit);
    }
    
    // 返回模拟数据
    return NextResponse.json(filteredModules, { status: 200 });
  } catch (error) {
    console.error("获取模块列表失败:", error);
    
    // 处理验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: "获取模块列表失败" }, { status: 500 });
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
