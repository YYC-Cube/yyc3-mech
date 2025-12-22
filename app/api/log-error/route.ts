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
    // Rate limiting
    const clientId = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
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
