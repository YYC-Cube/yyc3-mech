import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  try {
    // 检查API是否正常工作
    const healthStatus = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: env.version,
      apis: {
        modules: "ok",
        // 可以添加更多API状态检查
      },
    };

    // 返回健康状态
    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    console.error("健康检查失败:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "健康检查失败",
      },
      { status: 500 },
    );
  }
}
