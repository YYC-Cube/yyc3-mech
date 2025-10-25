import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 从URL获取参数
    const id = request.nextUrl.pathname.split('/').pop() || '';
    
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { isFavorite } = await request.json();

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
