import { z } from 'zod';

/**
 * 验证模块ID，防止路径遍历攻击
 * Validate module ID to prevent path traversal attacks
 */
export const moduleIdSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);

/**
 * 从Next.js路径中安全地提取模块ID
 * Safely extract module ID from Next.js pathname
 */
export function extractModuleIdFromPath(pathname: string): string {
  return pathname.split('/').filter(Boolean).pop() || '';
}

/**
 * 验证并获取模块ID
 * Validate and get module ID
 */
export function getValidatedModuleId(pathname: string): { success: true; data: string } | { success: false; error: string } {
  const id = extractModuleIdFromPath(pathname);
  const result = moduleIdSchema.safeParse(id);
  
  if (!result.success) {
    return { success: false, error: '无效的模块ID' };
  }
  
  return { success: true, data: result.data };
}
