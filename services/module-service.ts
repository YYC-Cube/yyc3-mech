import type { ModuleData } from "@/types/module";
import { mockModules } from "./mock-data";

// 简化版错误处理
function handleError(error: any, options: any) {
  console.error("Error:", error);
  return options.fallback;
}

// 检查是否在预览环境中
const isPreviewEnv = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname.includes("preview") ||
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("vusercontent")
  );
};

// 获取所有模块
export async function getAllModules(): Promise<ModuleData[]> {
  // 在预览环境中直接返回模拟数据
  if (isPreviewEnv()) {
    console.log("预览环境中使用模拟数据");
    return mockModules;
  }

  try {
    // 使用优化后的API客户端
    // const response = await apiClient.get<ModuleData[]>("modules")
    const response = { data: mockModules, error: null }; // 模拟API响应

    if (response.error) {
      return handleError(response.error, {
        tags: ["module-service", "get-all-modules"],
        fallback: mockModules,
      });
    }

    return response.data || mockModules;
  } catch (error) {
    return handleError(error, {
      tags: ["module-service", "get-all-modules"],
      fallback: mockModules,
    });
  }
}

// 获取单个模块详情
export async function getModuleById(id: string): Promise<ModuleData | null> {
  // 在预览环境中直接从模拟数据中查找
  if (isPreviewEnv()) {
    console.log("预览环境中使用模拟数据");
    return mockModules.find((m) => m.id === id) || null;
  }

  try {
    // 使用优化后的API客户端
    // const response = await apiClient.get<ModuleData>(`modules/${id}`)
    const response = {
      data: mockModules.find((m) => m.id === id) || null,
      error: null,
    }; // 模拟API响应

    if (response.error) {
      return handleError(response.error, {
        tags: ["module-service", "get-module-by-id"],
        metadata: { moduleId: id },
        fallback: mockModules.find((m) => m.id === id) || null,
      });
    }

    return response.data || mockModules.find((m) => m.id === id) || null;
  } catch (error) {
    return handleError(error, {
      tags: ["module-service", "get-module-by-id"],
      metadata: { moduleId: id },
      fallback: mockModules.find((m) => m.id === id) || null,
    });
  }
}

// 收藏模块
export async function toggleFavoriteModule(
  id: string,
  isFavorite: boolean,
): Promise<boolean> {
  // 在预览环境中模拟成功
  if (isPreviewEnv()) {
    console.log(`预览环境中模拟收藏模块 ${id}: ${isFavorite}`);
    return true;
  }

  try {
    // 使用优化后的API客户端
    // const response = await apiClient.post<{ success: boolean }>(`modules/${id}/favorite`, {
    //   isFavorite,
    // })
    const response = { data: { success: true }, error: null }; // 模拟API响应

    if (response.error) {
      return handleError(response.error, {
        tags: ["module-service", "toggle-favorite"],
        metadata: { moduleId: id, isFavorite },
        fallback: false,
      });
    }

    return response.data?.success || false;
  } catch (error) {
    return handleError(error, {
      tags: ["module-service", "toggle-favorite"],
      metadata: { moduleId: id, isFavorite },
      fallback: false,
    });
  }
}

// 评分模块
export async function rateModule(id: string, rating: number): Promise<boolean> {
  // 在预览环境中模拟成功
  if (isPreviewEnv()) {
    console.log(`预览环境中模拟评分模块 ${id}: ${rating}`);
    return true;
  }

  try {
    // 使用优化后的API客户端
    // const response = await apiClient.post<{ success: boolean }>(`modules/${id}/rate`, { rating })
    const response = { data: { success: true }, error: null }; // 模拟API响应

    if (response.error) {
      return handleError(response.error, {
        tags: ["module-service", "rate-module"],
        metadata: { moduleId: id, rating },
        fallback: false,
      });
    }

    return response.data?.success || false;
  } catch (error) {
    return handleError(error, {
      tags: ["module-service", "rate-module"],
      metadata: { moduleId: id, rating },
      fallback: false,
    });
  }
}

// 分享模块
export async function shareModule(
  id: string,
  platform: string,
): Promise<{ url: string }> {
  // 在预览环境中模拟成功
  if (isPreviewEnv()) {
    console.log(`预览环境中模拟分享模块 ${id} 到 ${platform}`);
    return { url: `https://example.com/share/${id}` };
  }

  try {
    // 使用优化后的API客户端
    // const response = await apiClient.post<{ url: string }>(`modules/${id}/share`, { platform })
    const response = {
      data: { url: `https://example.com/share/${id}` },
      error: null,
    }; // 模拟API响应

    if (response.error) {
      return handleError(response.error, {
        tags: ["module-service", "share-module"],
        metadata: { moduleId: id, platform },
        fallback: { url: "" },
      });
    }

    return response.data || { url: "" };
  } catch (error) {
    return handleError(error, {
      tags: ["module-service", "share-module"],
      metadata: { moduleId: id, platform },
      fallback: { url: "" },
    });
  }
}
