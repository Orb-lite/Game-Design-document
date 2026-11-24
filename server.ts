import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const SESSION_TTL_MS = 45_000;
const DATA_DIR = path.resolve(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'visitor-traffic.json');

interface DailyBucket {
  views: number;
  uniqueHashes: string[];
}

interface RecentVisitorEntry {
  id: string;
  timestamp: string;
  maskedIp: string;
  country: string;
  deviceType: string;
  browser: string;
  os: string;
  tab: string;
  section: string;
  referrer: string;
}

interface PersistedTrafficStore {
  totalPageViews: number;
  uniqueHashes: string[];
  peakConcurrent: number;
  dailyHistory: Record<string, DailyBucket>;
  hourlyToday: {
    date: string;
    hours: number[];
  };
  sections: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  referrers: Record<string, number>;
  recentVisitors: RecentVisitorEntry[];
}

interface ActiveSession {
  sessionId: string;
  visitorId: string;
  maskedIp: string;
  country: string;
  deviceType: string;
  browser: string;
  os: string;
  currentTab: string;
  currentSection: string;
  referrer: string;
  timezone: string;
  screen: string;
  connectedAt: number;
  lastSeenAt: number;
}

export interface VisitorTrafficSnapshot {
  serverTime: number;
  onlineNow: number;
  peakConcurrent: number;
  totalPageViews: number;
  uniqueVisitors: number;
  todayPageViews: number;
  todayUniqueVisitors: number;
  activeSessions: Array<{
    sessionId: string;
    maskedIp: string;
    country: string;
    deviceType: string;
    browser: string;
    os: string;
    currentTab: string;
    currentSection: string;
    referrer: string;
    timezone: string;
    screen: string;
    connectedAt: number;
    lastSeenAt: number;
  }>;
  dailyHistory: Array<{ date: string; views: number; uniqueVisitors: number }>;
  hourlyToday: Array<{ hour: number; views: number }>;
  sections: Array<{ name: string; count: number }>;
  countries: Array<{ name: string; count: number }>;
  devices: Array<{ name: string; count: number }>;
  browsers: Array<{ name: string; count: number }>;
  referrers: Array<{ name: string; count: number }>;
  recentVisitors: RecentVisitorEntry[];
}

function getTodayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyStore(): PersistedTrafficStore {
  return {
    totalPageViews: 0,
    uniqueHashes: [],
    peakConcurrent: 0,
    dailyHistory: {},
    hourlyToday: {
      date: getTodayUtcDate(),
      hours: Array.from({ length: 24 }, () => 0),
    },
    sections: {},
    countries: {},
    devices: {},
    browsers: {},
    referrers: {},
    recentVisitors: [],
  };
}

function loadStore(): PersistedTrafficStore {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return createEmptyStore();
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PersistedTrafficStore>;
    const today = getTodayUtcDate();
    return {
      totalPageViews: typeof parsed.totalPageViews === 'number' ? parsed.totalPageViews : 0,
      uniqueHashes: Array.isArray(parsed.uniqueHashes) ? parsed.uniqueHashes : [],
      peakConcurrent: typeof parsed.peakConcurrent === 'number' ? parsed.peakConcurrent : 0,
      dailyHistory: parsed.dailyHistory && typeof parsed.dailyHistory === 'object' ? parsed.dailyHistory : {},
      hourlyToday:
        parsed.hourlyToday &&
        parsed.hourlyToday.date === today &&
        Array.isArray(parsed.hourlyToday.hours) &&
        parsed.hourlyToday.hours.length === 24
          ? parsed.hourlyToday
          : { date: today, hours: Array.from({ length: 24 }, () => 0) },
      sections: parsed.sections && typeof parsed.sections === 'object' ? parsed.sections : {},
      countries: parsed.countries && typeof parsed.countries === 'object' ? parsed.countries : {},
      devices: parsed.devices && typeof parsed.devices === 'object' ? parsed.devices : {},
      browsers: parsed.browsers && typeof parsed.browsers === 'object' ? parsed.browsers : {},
      referrers: parsed.referrers && typeof parsed.referrers === 'object' ? parsed.referrers : {},
      recentVisitors: Array.isArray(parsed.recentVisitors) ? parsed.recentVisitors : [],
    };
  } catch {
    return createEmptyStore();
  }
}

const store = loadStore();
const uniqueHashSet = new Set<string>(store.uniqueHashes);
const activeSessions = new Map<string, ActiveSession>();
const countedSessions = new Set<string>();
const sseClients = new Set<Response>();

let saveTimer: NodeJS.Timeout | null = null;
function scheduleSave(): void {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      store.uniqueHashes = Array.from(uniqueHashSet).slice(-50_000);
      const tmpFile = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(store), 'utf8');
      fs.renameSync(tmpFile, DATA_FILE);
    } catch (err) {
      console.error('Failed to persist visitor traffic:', err);
    }
  }, 400);
}

function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  let ip = '';
  if (typeof fwd === 'string' && fwd.trim().length > 0) {
    ip = fwd.split(',')[0].trim();
  } else if (Array.isArray(fwd) && fwd.length > 0) {
    ip = fwd[0].split(',')[0].trim();
  } else {
    ip = req.ip || req.socket.remoteAddress || '';
  }
  return ip.replace(/^::ffff:/, '') || '127.0.0.1';
}

function maskIp(ip: string): string {
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return `${parts.slice(0, 3).join(':') || '::1'}:xxxx`;
  }
  return 'masked';
}

function hashVisitor(ip: string, visitorId: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}|${visitorId}`)
    .digest('hex')
    .slice(0, 16);
}

function detectCountry(req: Request): string {
  const headerKeys = [
    'cf-ipcountry',
    'x-appengine-country',
    'x-vercel-ip-country',
    'x-country-code',
  ];
  for (const key of headerKeys) {
    const raw = req.headers[key];
    if (typeof raw === 'string' && /^[A-Za-z]{2}$/.test(raw.trim())) {
      const code = raw.trim().toUpperCase();
      if (code !== 'XX' && code !== 'T1') return code;
    }
  }
  const acceptLang = req.headers['accept-language'];
  if (typeof acceptLang === 'string') {
    const match = acceptLang.match(/[a-z]{2}-([A-Z]{2})/);
    if (match?.[1]) return match[1];
    const primary = acceptLang.split(',')[0]?.trim().slice(0, 2).toUpperCase();
    if (primary && /^[A-Z]{2}$/.test(primary)) return primary;
  }
  return 'Direct';
}

function parseUserAgent(uaRaw: string | undefined): {
  browser: string;
  os: string;
  deviceType: string;
} {
  const ua = uaRaw || '';
  let browser = 'Other';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome\/|CriOS\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\/|FxiOS\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let deviceType = 'Desktop';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) deviceType = 'Tablet';
  else if (/Mobi|Android|iPhone|iPod/i.test(ua)) deviceType = 'Mobile';

  return { browser, os, deviceType };
}

function sanitizeReferrer(rawRef: unknown, hostHeader: string | undefined): string {
  if (typeof rawRef !== 'string' || !rawRef.trim()) {
    return 'Direct Entry';
  }
  try {
    const url = new URL(rawRef);
    const reqHost = (hostHeader || '').split(':')[0].toLowerCase();
    if (url.hostname.toLowerCase() === reqHost) {
      return 'Direct Entry';
    }
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Direct Entry';
  }
}

function sanitizeShortText(value: unknown, fallback: string, maxLen = 64): string {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
  return cleaned || fallback;
}

function rollHourlyDay(): void {
  const today = getTodayUtcDate();
  if (store.hourlyToday.date !== today) {
    store.hourlyToday = {
      date: today,
      hours: Array.from({ length: 24 }, () => 0),
    };
  }
}

function pruneExpiredSessions(): boolean {
  const now = Date.now();
  let removed = false;
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.lastSeenAt > SESSION_TTL_MS) {
      activeSessions.delete(id);
      removed = true;
    }
  }
  return removed;
}

function toSortedList(record: Record<string, number>, limit = 8): Array<{ name: string; count: number }> {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function buildSnapshot(): VisitorTrafficSnapshot {
  pruneExpiredSessions();
  rollHourlyDay();
  const today = getTodayUtcDate();
  const todayBucket = store.dailyHistory[today];

  // Build continuous 14-day series up to today UTC
  const dailySeries: Array<{ date: string; views: number; uniqueVisitors: number }> = [];
  const nowDate = new Date();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(nowDate);
    d.setUTCDate(nowDate.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = store.dailyHistory[key];
    dailySeries.push({
      date: key,
      views: entry?.views ?? 0,
      uniqueVisitors: entry ? entry.uniqueHashes.length : 0,
    });
  }

  const sessionsList = Array.from(activeSessions.values())
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .map((s) => ({
      sessionId: s.sessionId,
      maskedIp: s.maskedIp,
      country: s.country,
      deviceType: s.deviceType,
      browser: s.browser,
      os: s.os,
      currentTab: s.currentTab,
      currentSection: s.currentSection,
      referrer: s.referrer,
      timezone: s.timezone,
      screen: s.screen,
      connectedAt: s.connectedAt,
      lastSeenAt: s.lastSeenAt,
    }));

  return {
    serverTime: Date.now(),
    onlineNow: sessionsList.length,
    peakConcurrent: store.peakConcurrent,
    totalPageViews: store.totalPageViews,
    uniqueVisitors: uniqueHashSet.size,
    todayPageViews: todayBucket?.views ?? 0,
    todayUniqueVisitors: todayBucket ? todayBucket.uniqueHashes.length : 0,
    activeSessions: sessionsList,
    dailyHistory: dailySeries,
    hourlyToday: store.hourlyToday.hours.map((views, hour) => ({ hour, views })),
    sections: toSortedList(store.sections, 8),
    countries: toSortedList(store.countries, 10),
    devices: toSortedList(store.devices, 5),
    browsers: toSortedList(store.browsers, 6),
    referrers: toSortedList(store.referrers, 8),
    recentVisitors: store.recentVisitors.slice(0, 25),
  };
}

function broadcastSnapshot(): void {
  if (sseClients.size === 0) return;
  const payload = `event: snapshot\ndata: ${JSON.stringify(buildSnapshot())}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch {
      sseClients.delete(res);
    }
  }
}

setInterval(() => {
  if (pruneExpiredSessions()) {
    broadcastSnapshot();
  }
}, 10_000);

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '32kb' }));
  app.use(express.text({ type: 'text/plain', limit: '8kb' }));

  app.get('/api/visitors/stats', (_req, res) => {
    res.json(buildSnapshot());
  });

  app.get('/api/visitors/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    res.write(`event: snapshot\ndata: ${JSON.stringify(buildSnapshot())}\n\n`);

    const keepAlive = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(keepAlive);
        sseClients.delete(res);
      }
    }, 25_000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  app.post('/api/visitors/heartbeat', (req, res) => {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const sessionId = sanitizeShortText(body.sessionId, crypto.randomUUID(), 64);
    const visitorId = sanitizeShortText(body.visitorId, sessionId, 64);
    const currentTab = sanitizeShortText(body.tab, 'Master Document', 48);
    const currentSection = sanitizeShortText(body.section, 'Overview', 48);
    const timezone = sanitizeShortText(body.timezone, 'UTC', 48);
    const screen = sanitizeShortText(body.screen, 'Unknown', 24);

    const ip = getClientIp(req);
    const maskedIp = maskIp(ip);
    const visitorHash = hashVisitor(ip, visitorId);
    const country = detectCountry(req);
    const { browser, os, deviceType } = parseUserAgent(req.headers['user-agent']);
    const referrer = sanitizeReferrer(body.referrer ?? req.headers.referer, req.headers.host);
    const now = Date.now();

    const prevSession = activeSessions.get(sessionId);
    const changedView =
      !prevSession ||
      prevSession.currentTab !== currentTab ||
      prevSession.currentSection !== currentSection;

    activeSessions.set(sessionId, {
      sessionId,
      visitorId,
      maskedIp,
      country,
      deviceType,
      browser,
      os,
      currentTab,
      currentSection,
      referrer,
      timezone,
      screen,
      connectedAt: prevSession?.connectedAt ?? now,
      lastSeenAt: now,
    });

    let recordedNewVisit = false;
    if (!countedSessions.has(sessionId)) {
      countedSessions.add(sessionId);
      recordedNewVisit = true;
      rollHourlyDay();
      const today = getTodayUtcDate();
      const utcHour = new Date().getUTCHours();

      store.totalPageViews += 1;
      uniqueHashSet.add(visitorHash);

      if (!store.dailyHistory[today]) {
        store.dailyHistory[today] = { views: 0, uniqueHashes: [] };
      }
      store.dailyHistory[today].views += 1;
      if (!store.dailyHistory[today].uniqueHashes.includes(visitorHash)) {
        store.dailyHistory[today].uniqueHashes.push(visitorHash);
      }

      // Prune daily history older than 30 days
      const keys = Object.keys(store.dailyHistory).sort();
      if (keys.length > 30) {
        for (const oldKey of keys.slice(0, keys.length - 30)) {
          delete store.dailyHistory[oldKey];
        }
      }

      store.hourlyToday.hours[utcHour] = (store.hourlyToday.hours[utcHour] ?? 0) + 1;
      store.sections[currentTab] = (store.sections[currentTab] ?? 0) + 1;
      store.countries[country] = (store.countries[country] ?? 0) + 1;
      store.devices[deviceType] = (store.devices[deviceType] ?? 0) + 1;
      store.browsers[browser] = (store.browsers[browser] ?? 0) + 1;
      store.referrers[referrer] = (store.referrers[referrer] ?? 0) + 1;

      store.recentVisitors.unshift({
        id: `${now}-${sessionId.slice(0, 6)}`,
        timestamp: new Date(now).toISOString(),
        maskedIp,
        country,
        deviceType,
        browser,
        os,
        tab: currentTab,
        section: currentSection,
        referrer,
      });
      store.recentVisitors = store.recentVisitors.slice(0, 30);
    } else if (changedView) {
      store.sections[currentTab] = (store.sections[currentTab] ?? 0) + 1;
    }

    if (activeSessions.size > store.peakConcurrent) {
      store.peakConcurrent = activeSessions.size;
    }

    if (recordedNewVisit || changedView) {
      scheduleSave();
      broadcastSnapshot();
    }

    res.json({ ok: true, snapshot: buildSnapshot() });
  });

  app.post('/api/visitors/leave', (req, res) => {
    let sessionId = '';
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body) as Record<string, unknown>;
        sessionId = sanitizeShortText(parsed.sessionId, '', 64);
      } catch {
        sessionId = '';
      }
    } else if (req.body && typeof req.body === 'object') {
      sessionId = sanitizeShortText((req.body as Record<string, unknown>).sessionId, '', 64);
    }

    if (sessionId && activeSessions.delete(sessionId)) {
      broadcastSnapshot();
    }
    res.status(204).end();
  });

  const distDir = path.resolve(__dirname, 'dist');
  const distIndex = path.join(distDir, 'index.html');
  const runningTsx = process.argv.some((arg) => arg.includes('tsx')) || process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production' || (!runningTsx && fs.existsSync(distIndex));

  if (isProd) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Valdris Chronicle server listening on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

void startServer();
