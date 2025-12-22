import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getValidatedModuleId } from '@/lib/api-utils';

// 定义请求体验证模式
const shareSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'wechat', 'email', 'other']),
});

export async function POST(request: NextRequest) {
  try {
    // 从URL获取参数并验证
    const validationResult = getValidatedModuleId(request.nextUrl.pathname);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error, url: "" },
        { status: 400 },
      );
    }
    
    const id = validationResult.data;
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const body = await request.json();
    
    // 验证请求体
    const validation = shareSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "无效的分享平台", url: "" },
        { status: 400 },
      );
    }
    
    const { platform } = validation.data;

    console.log(`模块 ${id} 已分享到: ${platform}`);

    // 使用验证过的ID构建URL
    return NextResponse.json({
      url: `https://nexus-ai.example.com/share/${id}`,
    });
  } catch (error) {
    console.error('分享模块失败:', error);
    return NextResponse.json({ error: "分享失败", url: "" }, { status: 500 });
  }
}
