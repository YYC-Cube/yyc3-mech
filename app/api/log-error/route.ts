export const runtime = 'nodejs';

import fs from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.ndjson');

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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const payload = {
      ...data,
      receivedAt: new Date().toISOString(),
    };
    await appendLog(payload);
    console.log('[API] Received error log:', payload);
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
