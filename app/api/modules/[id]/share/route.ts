import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 从URL获取参数
    const id = request.nextUrl.pathname.split('/').pop() || '';
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { platform } = await request.json();

    console.log(`模块 ${id} 已分享到: ${platform}`);

    return NextResponse.json({
      url: `https://nexus-ai.example.com/share/${id}`,
    });
  } catch (error) {
    console.error('分享模块失败:', error);
    return NextResponse.json({ error: "分享失败", url: "" }, { status: 500 });
  }
}
