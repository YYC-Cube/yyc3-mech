#!/usr/bin/env node
/*
  Parse NDJSON logs from logs/errors.ndjson and logs/vitals.ndjson
  Outputs a concise summary: error counts by severity/tags and vitals averages.
  Usage:
    node scripts/parse-logs.js                # default summary + recent(5) + by-path
    node scripts/parse-logs.js --last 2       # show last 2 of both types
    node scripts/parse-logs.js --last 3 --type vitals    # show last 3 vitals only
    node scripts/parse-logs.js --path /       # filter recent vitals by path
    node scripts/parse-logs.js --by-path      # show aggregation by path
*/
const fs = require('node:fs');
const path = require('node:path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const ERROR_FILE = path.join(LOG_DIR, 'errors.ndjson');
const VITALS_FILE = path.join(LOG_DIR, 'vitals.ndjson');

function readNdjson(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line); } catch { return null; }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function summarizeErrors(errors) {
  const severity = {};
  const tags = {};
  for (const e of errors) {
    const s = e.severity || 'unknown';
    severity[s] = (severity[s] || 0) + 1;
    for (const t of e.tags || []) tags[t] = (tags[t] || 0) + 1;
  }
  return { total: errors.length, severity, tags };
}

function summarizeVitals(vitals) {
  const vals = { CLS: [], LCP: [], TTFB: [], INP: [] };
  for (const v of vitals) {
    if (v.name in vals && typeof v.value === 'number') vals[v.name].push(v.value);
  }
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  return {
    total: vitals.length,
    average: {
      CLS: avg(vals.CLS),
      FID: null,
      LCP: avg(vals.LCP),
      TTFB: avg(vals.TTFB),
      INP: avg(vals.INP),
    },
  };
}

function groupByPath(vitals) {
  const groups = {};
  for (const v of vitals) {
    const key = v.path || 'unknown';
    groups[key] ||= { count: 0, metrics: {} };
    const g = groups[key];
    g.count += 1;
    g.metrics[v.name] = (g.metrics[v.name] || 0) + 1;
  }
  return groups;
}

function parseArgs(argv) {
  const args = { last: 5, type: 'both', path: null, byPath: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--last' || a === '-l') {
      args.last = parseInt(argv[++i], 10) || args.last;
    } else if (a === '--type') {
      const t = argv[++i];
      if (t === 'errors' || t === 'vitals') args.type = t; else args.type = 'both';
    } else if (a === '--path') {
      args.path = argv[++i] || null;
    } else if (a === '--by-path') {
      args.byPath = true;
    } else if (a === '--no-by-path') {
      args.byPath = false;
    }
  }
  return args;
}

function filterByPath(vitals, p) {
  if (!p) return vitals;
  return vitals.filter(v => (v.path || 'unknown') === p);
}

function main() {
  const args = parseArgs(process.argv);
  let errors = readNdjson(ERROR_FILE);
  const vitalsAll = readNdjson(VITALS_FILE);
  const vitals = filterByPath(vitalsAll, args.path);

  // 支持错误按 path 过滤（优先使用 e.path，回退 metadata.fileName）
  if (args.path) {
    errors = errors.filter(e => (e.path || (e.metadata && e.metadata.fileName) || 'unknown') === args.path);
  }

  const errorSummary = summarizeErrors(errors);
  const vitalsSummary = summarizeVitals(vitals);
  const vitalsByPath = groupByPath(vitals);

  console.log('--- Logs Summary ---');
  if (args.type !== 'vitals') console.log('Errors:', JSON.stringify(errorSummary, null, 2));
  if (args.type !== 'errors') console.log('Vitals:', JSON.stringify(vitalsSummary, null, 2));

  // 最近N条明细
  const last = (arr, n) => arr.slice(-n);
  console.log('\n--- Recent (last %d) ---', args.last);
  if (args.type !== 'vitals') console.log('Errors(last):', JSON.stringify(last(errors, args.last), null, 2));
  if (args.type !== 'errors') console.log('Vitals(last):', JSON.stringify(last(vitals, args.last), null, 2));

  // 按页面聚合
  if (args.byPath && args.type !== 'errors') {
    console.log('\n--- Vitals by Path ---');
    console.log(JSON.stringify(vitalsByPath, null, 2));
  }
}

if (require.main === module) {
  main();
}
