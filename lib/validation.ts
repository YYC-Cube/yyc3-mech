import { z } from 'zod';

// 定义模块评分请求验证模式
export const rateModuleSchema = z.object({
  rating: z.number()
    .min(1, '评分不能低于1分')
    .max(5, '评分不能高于5分')
    .refine(value => Number.isInteger(value), '评分必须是整数')
});

// 定义模块ID验证模式
export const moduleIdSchema = z.string()
  .min(1, '模块ID不能为空')
  .regex(/^[a-zA-Z0-9-_]+$/, '模块ID只能包含字母、数字、下划线和连字符');