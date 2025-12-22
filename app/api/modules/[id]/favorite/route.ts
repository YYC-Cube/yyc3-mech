import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getValidatedModuleId } from '@/lib/api-utils';

// 定义请求体验证模式
const favoriteSchema = z.object({
  isFavorite: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    // 从URL获取参数并验证
    const validationResult = getValidatedModuleId(request.nextUrl.pathname);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error, success: false },
        { status: 400 },
      );
    }
    
    const id = validationResult.data;
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const body = await request.json();
    
    // 验证请求体
    const validation = favoriteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "无效的请求参数", success: false },
        { status: 400 },
      );
    }
    
    const { isFavorite } = validation.data;

    console.log(`模块 ${id} 收藏状态已更改为: ${isFavorite}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新模块收藏状态失败:', error);
    return NextResponse.json(
      { error: "更新收藏状态失败", success: false },
      { status: 500 },
    );
  }
}
