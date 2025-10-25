export const runtime = "nodejs";

import fs from "node:fs/promises";
import path from "node:path";

async function readNdjson(file: string) {
  try {
    const exists = await fs
      .access(file)
      .then(() => true)
      .catch(() => false);
    if (!exists) return [] as any[];
    const content = await fs.readFile(file, "utf8");
    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [] as any[];
  }
}

function summarizeVitals(vitals: any[]) {
  const vals: Record<string, number[]> = { CLS: [], LCP: [], TTFB: [], INP: [] };
  for (const v of vitals) {
    if (v.name && typeof v.value === "number") {
      vals[v.name] ||= [];
      vals[v.name].push(v.value);
    }
  }
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  return {
    total: vitals.length,
    average: {
      CLS: avg(vals.CLS || []),
      FID: null,
      LCP: avg(vals.LCP || []),
      TTFB: avg(vals.TTFB || []),
      INP: avg(vals.INP || []),
    },
  };
}

function groupByPath(vitals: any[]) {
  const groups: Record<string, { count: number; metrics: Record<string, number> }> = {};
  for (const v of vitals) {
    const key = v.path || "unknown";
    groups[key] ||= { count: 0, metrics: {} };
    const g = groups[key];
    g.count += 1;
    g.metrics[v.name] = (g.metrics[v.name] || 0) + 1;
  }
  return groups;
}

function summarizeErrors(errors: any[]) {
  const bySeverity: Record<string, number> = {};
  const byTag: Record<string, number> = {};
  for (const e of errors) {
    const sev = (e.severity || 'medium').toLowerCase();
    bySeverity[sev] = (bySeverity[sev] || 0) + 1;
    if (Array.isArray(e.tags)) {
      for (const t of e.tags) {
        byTag[t] = (byTag[t] || 0) + 1;
      }
    }
  }
  return { total: errors.length, bySeverity, byTag };
}

function groupErrorsByPath(errors: any[]) {
  const groups: Record<string, { count: number }> = {};
  for (const e of errors) {
    const key = e.path || e.metadata?.fileName || 'unknown';
    groups[key] ||= { count: 0 };
    groups[key].count += 1;
  }
  return groups;
}

export default async function ObservabilityPage({ searchParams }: { searchParams: { path?: string; last?: string; type?: string; rating?: string } }) {
  const LOG_DIR = path.join(process.cwd(), "logs");
  const VITALS_FILE = path.join(LOG_DIR, "vitals.ndjson");
  const ERRORS_FILE = path.join(LOG_DIR, "errors.ndjson");

  // 读取与筛选
  const vitalsAll = await readNdjson(VITALS_FILE);
  const errorsAll = await readNdjson(ERRORS_FILE);
  const pathFilter = searchParams?.path || null;
  const lastN = Number(searchParams?.last) || 10;
  const type = searchParams?.type === 'errors' ? 'errors' : 'vitals';
  const ratingFilter = searchParams?.rating || null;

  const vitalsByPath = pathFilter ? vitalsAll.filter(v => (v.path || 'unknown') === pathFilter) : vitalsAll;
  const vitals = ratingFilter ? vitalsByPath.filter(v => (v.rating || '').toLowerCase() === ratingFilter) : vitalsByPath;
  const errorsByPath = pathFilter ? errorsAll.filter(e => (e.path || e.metadata?.fileName || 'unknown') === pathFilter) : errorsAll;
  const errors = errorsByPath;

  const vitalsSummary = summarizeVitals(vitals);
  const vitalsByPathGroups = groupByPath(vitals);

  const errorsSummary = summarizeErrors(errors);
  const errorsByPathGroups = groupErrorsByPath(errors);

  const recentVitals = vitals.slice(-lastN).reverse();
  const recentErrors = errors.slice(-lastN).reverse();

  return (
    <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE]">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold">系统观测 / Observability</h1>
        <p className="text-sm text-[#AAB2C0]">filters: type={type}, rating={ratingFilter || 'all'}, path={pathFilter || 'all'}, last={lastN}</p>

        <form method="GET" className="flex flex-wrap items-end gap-3 bg-[#1F2127] border border-[#25272E] rounded-md p-3">
          <div className="flex flex-col">
            <label className="text-xs mb-1">type</label>
            <select name="type" defaultValue={type} className="bg-[#23252B] border border-[#2A2C33] rounded px-2 py-1 text-sm">
              <option value="vitals">vitals</option>
              <option value="errors">errors</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs mb-1">rating (vitals)</label>
            <select name="rating" defaultValue={ratingFilter || ''} className="bg-[#23252B] border border-[#2A2C33] rounded px-2 py-1 text-sm">
              <option value="">all</option>
              <option value="good">good</option>
              <option value="needs-improvement">needs-improvement</option>
              <option value="poor">poor</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs mb-1">path</label>
            <input name="path" placeholder="/ 或留空为全站" defaultValue={pathFilter || ''} className="bg-[#23252B] border border-[#2A2C33] rounded px-2 py-1 text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs mb-1">last</label>
            <input type="number" min={1} max={100} name="last" defaultValue={lastN} className="bg-[#23252B] border border-[#2A2C33] rounded px-2 py-1 text-sm w-20" />
          </div>
          <button type="submit" className="ml-auto bg-[#2E3139] hover:bg-[#383B44] text-sm px-3 py-1 rounded border border-[#2A2C33]">应用筛选</button>
          <a href="/observability" className="bg-[#1B1D23] hover:bg-[#23252B] text-sm px-3 py-1 rounded border border-[#2A2C33]">清空筛选</a>
        </form>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-[#25272E] bg-[#1F2127] p-4">
            <h2 className="text-lg font-semibold mb-3">{type === 'vitals' ? 'Vitals 概览' : '错误概览'}</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(type === 'vitals' ? vitalsSummary : errorsSummary, null, 2)}</pre>
          </div>
          <div className="rounded-lg border border-[#25272E] bg-[#1F2127] p-4">
            <h2 className="text-lg font-semibold mb-3">按页面聚合</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(type === 'vitals' ? vitalsByPathGroups : errorsByPathGroups, null, 2)}</pre>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-[#25272E] bg-[#1F2127] p-4">
            <h2 className="text-lg font-semibold mb-3">最近 Vitals（{lastN}）</h2>
            <div className="space-y-3">
              {recentVitals.map((v, i) => (
                <div key={i} className="rounded-md border border-[#2A2C33] bg-[#23252B] p-3">
                  <div className="text-sm">{v.timestamp || v.receivedAt}</div>
                  <div className="text-sm">{v.name}: {String(v.value)} <span className="text-xs text-[#AAB2C0]">({v.rating})</span></div>
                  <div className="text-xs text-[#AAB2C0]">path: {v.path || 'unknown'}</div>
                </div>
              ))}
              {recentVitals.length === 0 && <div className="text-sm text-[#AAB2C0]">暂无数据</div>}
            </div>
          </div>
          <div className="rounded-lg border border-[#25272E] bg-[#1F2127] p-4">
            <h2 className="text-lg font-semibold mb-3">最近错误（{lastN}）</h2>
            <div className="space-y-3">
              {recentErrors.map((e, i) => (
                <div key={i} className="rounded-md border border-[#2A2C33] bg-[#23252B] p-3">
                  <div className="text-sm">{e.timestamp || e.receivedAt}</div>
                  <div className="text-sm">{e.message}</div>
                  <div className="text-xs text-[#AAB2C0]">severity: {e.severity || 'medium'}</div>
                </div>
              ))}
              {recentErrors.length === 0 && <div className="text-sm text-[#AAB2C0]">暂无错误</div>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}