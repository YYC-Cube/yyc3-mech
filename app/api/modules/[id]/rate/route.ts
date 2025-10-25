import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { rateModuleSchema, moduleIdSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // 从URL获取参数
    const id = request.nextUrl.pathname.split('/').pop() || '';
    
    // 验证模块ID
    const moduleIdResult = moduleIdSchema.safeParse(id);
    if (!moduleIdResult.success) {
      return NextResponse.json(
        { error: moduleIdResult.error.issues[0].message, success: false },
        { status: 400 },
      );
    }

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 验证请求体参数
    const body = await request.json();
    const ratingResult = rateModuleSchema.safeParse(body);
    
    if (!ratingResult.success) {
      return NextResponse.json(
        { error: ratingResult.error.issues[0].message, success: false },
        { status: 400 },
      );
    }

    const { rating } = ratingResult.data;

    console.log(`模块 ${id} 评分已更新为: ${rating}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新模块评分失败:', error);
    return NextResponse.json(
      { error: "更新评分失败", success: false },
      { status: 500 },
    );
  }
}
