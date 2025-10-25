export const runtime = 'nodejs';

import fs from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'vitals.ndjson');

function normalizeRating(name: string, value: number, rating?: string) {
  const r = (rating || '').toLowerCase();
  const fromMetric = () => {
    switch (name) {
      case 'CLS':
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
      case 'LCP':
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
      case 'TTFB':
        if (value <= 800) return 'good';
        if (value <= 1800) return 'needs-improvement';
        return 'poor';
      case 'INP':
        if (value <= 200) return 'good';
        if (value <= 500) return 'needs-improvement';
        return 'poor';
      default:
        return r || 'needs-improvement';
    }
  };
  // 如果已有 rating，统一为小写；否则按指标计算
  if (r === 'good' || r === 'needs-improvement' || r === 'poor') return r;
  return fromMetric();
}

async function appendLog(entry: unknown) {
  await fs.mkdir(LOG_DIR, { recursive: true });
  const line = JSON.stringify(entry) + '\n';
  // 基于文件大小的滚动（10MB）
  try {
    const stat = await fs.stat(LOG_FILE);
    const MAX = 10 * 1024 * 1024;
    if (stat.size >= MAX) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const rotated = path.join(LOG_DIR, `vitals-${ts}.ndjson`);
      await fs.rename(LOG_FILE, rotated);
      await fs.writeFile(LOG_FILE, '', 'utf8');
    }
  } catch {}
  await fs.appendFile(LOG_FILE, line, 'utf8');
}

export async function POST(req: Request) {
  try {
    const metric = await req.json();
    const rating = normalizeRating(metric?.name, Number(metric?.value) || 0, metric?.rating);
    const payload = {
      ...metric,
      rating,
      receivedAt: new Date().toISOString(),
    };
    await appendLog(payload);
    console.log('[Vitals]', payload);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    console.error('[Vitals] invalid payload', e);
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
}
