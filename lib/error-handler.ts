import { errorLogger } from "@/lib/error-logger";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorHandlerOptions {
  severity?: ErrorSeverity;
  tags?: string[];
  metadata?: Record<string, any>;
  silent?: boolean;
  showToUser?: boolean;
  fallback?: any;
}

export class AppError extends Error {
  code: string;
  severity: ErrorSeverity;
  metadata: Record<string, any>;

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity = "medium",
    metadata: Record<string, any> = {},
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.severity = severity;
    this.metadata = metadata;
  }
}

export class ApiError extends AppError {
  status: number;

  constructor(
    message: string,
    status: number,
    code = "API_ERROR",
    metadata: Record<string, any> = {},
  ) {
    super(message, code, status >= 500 ? "high" : "medium", metadata);
    this.name = "ApiError";
    this.status = status;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, "NETWORK_ERROR", "high", metadata);
    this.name = "NetworkError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, "VALIDATION_ERROR", "medium", metadata);
    this.name = "ValidationError";
  }
}

/**
 * 统一的错误处理函数
 *
 * @param error 错误对象
 * @param options 错误处理选项
 * @returns 如果提供了fallback，则返回fallback值
 */
export function handleError<T>(
  error: unknown,
  options: ErrorHandlerOptions = {},
): T | undefined {
  // 默认选项
  const {
    severity = "medium",
    tags = [],
    metadata = {},
    silent = false,
    showToUser = false,
    fallback = undefined,
  } = options;

  // 标准化错误对象
  let normalizedError: Error;

  if (error instanceof Error) {
    normalizedError = error;
  } else if (typeof error === "string") {
    normalizedError = new Error(error);
  } else {
    normalizedError = new Error("未知错误");
    metadata.originalError = error;
  }

  // 记录错误
  if (!silent) {
    errorLogger.logError(normalizedError, {
      severity,
      tags,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        errorType: normalizedError.name,
      },
    });
  }

  // 如果需要向用户显示错误
  if (showToUser) {
    // 这里可以集成全局的toast或通知系统
    console.error("用户可见错误:", normalizedError.message);

    // 如果有全局的toast系统，可以这样使用：
    // toast.error(normalizedError.message)
  }

  // 返回fallback值
  return fallback as T;
}

/**
 * 安全执行函数的包装器
 *
 * @param fn 要执行的函数
 * @param errorHandler 错误处理函数
 * @returns 包装后的安全函数
 */
export function safeFn<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (
    error: unknown,
    ...args: Parameters<T>
  ) => ReturnType<T> | undefined,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error, ...args);
      }

      handleError(error, {
        metadata: { functionName: fn.name, arguments: args },
      });

      return undefined;
    }
  };
}

/**
 * 安全执行异步函数的包装器
 *
 * @param fn 要执行的异步函数
 * @param errorHandler 错误处理函数
 * @returns 包装后的安全异步函数
 */
export function safeAsyncFn<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (
    error: unknown,
    ...args: Parameters<T>
  ) => Promise<ReturnType<T> extends Promise<infer R> ? R : any> | undefined,
): (
  ...args: Parameters<T>
) => Promise<ReturnType<T> extends Promise<infer R> ? R | undefined : any> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (errorHandler) {
        return await errorHandler(error, ...args);
      }

      handleError(error, {
        metadata: { functionName: fn.name, arguments: args },
      });

      return undefined;
    }
  };
}
