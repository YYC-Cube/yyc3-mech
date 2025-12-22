export const runtime = 'nodejs';

import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.ndjson');

// 定义日志数据的验证模式
const errorLogSchema = z.object({
  message: z.string().max(1000), // 限制消息长度防止日志炸弹
  level: z.enum(['error', 'warn', 'info', 'debug']).optional(),
  timestamp: z.string().optional(),
  stack: z.string().max(5000).optional(), // 限制堆栈长度
  metadata: z.record(z.unknown()).optional(),
}).strict(); // 严格模式，拒绝未知字段

async function appendLog(entry: unknown) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  const line = JSON.stringify(entry) + '\n';
  // 基于文件大小的滚动（10MB）
  try {
    const stat = await fs.stat(LOG_FILE);
    const MAX = 10 * 1024 * 1024;
    if (stat.size >= MAX) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const rotated = path.join(LOG_DIR, `errors-${ts}.ndjson`);
      await fs.rename(LOG_FILE, rotated);
      await fs.writeFile(LOG_FILE, '', 'utf8');
    }
  } catch {}
  await fs.appendFile(LOG_FILE, line, 'utf8');
}

// Rate limiting map (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

// 清理过期的速率限制记录
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // 每分钟清理一次

function getClientId(req: Request): string {
  // 优先使用 Cloudflare 或可信代理提供的真实IP
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // 对于已知的可信代理（如Vercel），可以使用x-forwarded-for
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  // 使用多个标识符的组合来提高安全性
  const userAgent = req.headers.get('user-agent') || '';
  const baseId = realIP || (forwardedFor?.split(',')[0].trim()) || 'unknown';
  
  // 结合 IP 和 User-Agent 的哈希值作为更可靠的客户端标识
  // 注意：这仍然可以被绕过，但增加了难度
  return `${baseId}-${userAgent.substring(0, 50)}`;
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(clientId);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limiting with improved client identification
    const clientId = getClientId(req);
    if (!checkRateLimit(clientId)) {
      return new Response(JSON.stringify({ ok: false, error: 'rate_limit_exceeded' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });
    }
    
    const data = await req.json();
    
    // 验证输入数据
    const validationResult = errorLogSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('[API] Invalid error log data:', validationResult.error);
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'invalid_payload',
        details: validationResult.error.issues[0].message 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    
    const payload = {
      ...validationResult.data,
      receivedAt: new Date().toISOString(),
    };
    
    await appendLog(payload);
    console.log('[API] Received error log:', { level: payload.level, message: payload.message?.substring(0, 100) });
    
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    console.error('[API] Failed to parse error log:', e);
    return new Response(JSON.stringify({ ok: false, error: 'invalid_payload' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
}
