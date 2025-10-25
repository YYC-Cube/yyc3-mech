import { env, getApiUrl } from "@/lib/env";
import { ApiError, NetworkError, handleError } from "@/lib/error-handler";

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  withCredentials?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export async function fetchWithRetry<T = any>(
  url: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  // 处理URL，确保使用正确的API前缀
  const fullUrl = url.startsWith("http") ? url : `${env.baseUrl}${url}`;

  const {
    retries = 3,
    retryDelay = 300,
    timeout = 10000,
    withCredentials = false,
    ...fetchOptions
  } = options;

  // 设置默认headers
  const headers = new Headers(fetchOptions.headers || {});
  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 如果需要携带凭证
  if (withCredentials) {
    fetchOptions.credentials = "include";
  }

  let lastError: Error | null = null;
  let attempts = 0;

  while (attempts <= retries) {
    try {
      attempts++;

      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T | null = null;
      let responseData: any = null;

      // 尝试解析响应
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        data = responseData as T;
      } else if (contentType && contentType.includes("text/")) {
        responseData = await response.text();
      } else {
        responseData = await response.blob();
      }

      // 检查响应状态
      if (!response.ok) {
        const error = new ApiError(
          responseData?.message || `请求失败: ${response.status}`,
          response.status,
          `HTTP_${response.status}`,
          {
            url,
            method: fetchOptions.method || "GET",
            responseData,
          },
        );

        // 如果是服务器错误且还有重试次数，则重试
        if (response.status >= 500 && attempts <= retries) {
          lastError = error;
          // 指数退避策略
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)),
          );
          continue;
        }

        // 使用统一的错误处理
        handleError(error, {
          tags: ["api-error", `status-${response.status}`],
          metadata: { url, method: fetchOptions.method || "GET" },
        });

        throw error;
      }

      return { data, error: null, status: response.status };
    } catch (error: any) {
      lastError = error;

      // 处理中止请求（超时）
      if (error.name === "AbortError") {
        const timeoutError = new NetworkError("请求超时", { url, timeout });

        // 如果还有重试次数，则重试
        if (attempts <= retries) {
          lastError = timeoutError;
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)),
          );
          continue;
        }

        handleError(timeoutError, {
          tags: ["api-error", "timeout"],
          metadata: { url, method: fetchOptions.method || "GET" },
        });

        return { data: null, error: timeoutError, status: 0 };
      }

      // 处理网络错误
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        const networkError = new NetworkError("网络连接失败", { url });

        // 如果还有重试次数，则重试
        if (attempts <= retries) {
          lastError = networkError;
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)),
          );
          continue;
        }

        handleError(networkError, {
          tags: ["api-error", "network-error"],
          metadata: { url, method: fetchOptions.method || "GET" },
        });

        return { data: null, error: networkError, status: 0 };
      }

      // 其他错误
      handleError(error, {
        severity: "high",
        tags: ["api-error"],
        metadata: { url, method: fetchOptions.method || "GET" },
      });

      return { data: null, error, status: error.status || 0 };
    }
  }

  return { data: null, error: lastError, status: 0 };
}

// 便捷方法
export const apiClient = {
  async get<T = any>(
    path: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(path);
    return fetchWithRetry<T>(url, { ...options, method: "GET" });
  },

  async post<T = any>(
    path: string,
    data?: any,
    options?: FetchOptions,
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(path);
    return fetchWithRetry<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T = any>(
    path: string,
    data?: any,
    options?: FetchOptions,
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(path);
    return fetchWithRetry<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T = any>(
    path: string,
    options?: FetchOptions,
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(path);
    return fetchWithRetry<T>(url, { ...options, method: "DELETE" });
  },
};
