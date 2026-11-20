import { useState } from 'react';
import {
  Activity,
  BarChart3,
  Clock,
  Globe,
  Laptop,
  Mail,
  Phone,
  RefreshCw,
  Smartphone,
  Tablet,
  Users,
} from 'lucide-react';
import { GENERATED_ASSETS, STUDIO_IDENTITY } from '../data/gddData';
import type { TrafficCountItem, VisitorTrafficSnapshot } from '../types/visitorTraffic';

interface WhoIsSectionProps {
  snapshot: VisitorTrafficSnapshot | null;
  currentSessionId: string;
  liveConnected: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

type BreakdownTab = 'sections' | 'countries' | 'devices' | 'referrers';
type ChartRange = '14d' | '24h';

function formatElapsed(connectedAt: number, serverTime: number): string {
  const diffSec = Math.max(0, Math.floor((serverTime - connectedAt) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatIsoTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[1]}/${parts[2]}`;
}

function DeviceIcon({ type }: { type: string }) {
  if (type === 'Mobile') return <Smartphone className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />;
  if (type === 'Tablet') return <Tablet className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />;
  return <Laptop className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />;
}

export function WhoIsSection({
  snapshot,
  currentSessionId,
  liveConnected,
  onRefresh,
  refreshing,
}: WhoIsSectionProps) {
  const [breakdownTab, setBreakdownTab] = useState<BreakdownTab>('sections');
  const [chartRange, setChartRange] = useState<ChartRange>('14d');

  const onlineNow = snapshot?.onlineNow ?? 0;
  const peakConcurrent = snapshot?.peakConcurrent ?? 0;
  const totalPageViews = snapshot?.totalPageViews ?? 0;
  const uniqueVisitors = snapshot?.uniqueVisitors ?? 0;
  const todayPageViews = snapshot?.todayPageViews ?? 0;
  const todayUniqueVisitors = snapshot?.todayUniqueVisitors ?? 0;
  const serverTime = snapshot?.serverTime ?? Date.now();

  const breakdownItems: TrafficCountItem[] = !snapshot
    ? []
    : breakdownTab === 'sections'
      ? snapshot.sections
      : breakdownTab === 'countries'
        ? snapshot.countries
        : breakdownTab === 'devices'
          ? [
              ...snapshot.devices.map((d) => ({ name: `Device: ${d.name}`, count: d.count })),
              ...snapshot.browsers.map((b) => ({ name: `Browser: ${b.name}`, count: b.count })),
            ]
          : snapshot.referrers;

  const breakdownMax = Math.max(1, ...breakdownItems.map((i) => i.count));

  const dailyMax = Math.max(1, ...(snapshot?.dailyHistory.map((d) => d.views) ?? [1]));
  const hourlyMax = Math.max(1, ...(snapshot?.hourlyToday.map((h) => h.views) ?? [1]));

  return (
    <section id="visitor-traffic" className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
              Private URL Telemetry · Who Is Online Now
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
              Real-Time Visitor Traffic &amp; Audience Counter
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#141417] px-3 py-1.5 text-xs text-[#D4CEC3]">
              <span
                className={`h-2 w-2 rounded-full ${
                  liveConnected ? 'bg-[#4F9E68] animate-pulse' : 'bg-[#C89B3C]'
                }`}
                aria-hidden="true"
              />
              <span>{liveConnected ? 'Live Stream Active' : 'Connecting Traffic Server...'}</span>
            </span>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#C89B3C]/50 bg-[#141417] px-3 py-1.5 text-xs font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/15 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#C89B3C] ${refreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Top 4 Real-Time KPI Cards */}
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-[#C89B3C]/40 bg-[#141417] p-5">
            <dt className="flex items-center justify-between text-xs text-[#9C968B]">
              <span>Online Now</span>
              <Users className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
            </dt>
            <dd className="font-mono-tabular mt-2 text-3xl font-bold text-[#F6EFE2]">
              {onlineNow}
            </dd>
            <p className="mt-1 text-[11px] text-[#B8B1A6]">
              Peak Concurrent: <span className="font-mono-tabular text-[#C89B3C]">{peakConcurrent}</span>
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#141417] p-5">
            <dt className="flex items-center justify-between text-xs text-[#9C968B]">
              <span>Total Page Views</span>
              <Activity className="h-4 w-4 text-[#4F9E68]" aria-hidden="true" />
            </dt>
            <dd className="font-mono-tabular mt-2 text-3xl font-bold text-[#F6EFE2]">
              {totalPageViews.toLocaleString()}
            </dd>
            <p className="mt-1 text-[11px] text-[#B8B1A6]">
              Persisted across server restarts
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#141417] p-5">
            <dt className="flex items-center justify-between text-xs text-[#9C968B]">
              <span>Unique Visitors</span>
              <Globe className="h-4 w-4 text-[#3E82C7]" aria-hidden="true" />
            </dt>
            <dd className="font-mono-tabular mt-2 text-3xl font-bold text-[#F6EFE2]">
              {uniqueVisitors.toLocaleString()}
            </dd>
            <p className="mt-1 text-[11px] text-[#B8B1A6]">
              Anonymized IP + Visitor ID
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#141417] p-5">
            <dt className="flex items-center justify-between text-xs text-[#9C968B]">
              <span>Visits Today (UTC)</span>
              <BarChart3 className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            </dt>
            <dd className="font-mono-tabular mt-2 text-3xl font-bold text-[#D4AF37]">
              {todayPageViews.toLocaleString()}
            </dd>
            <p className="mt-1 text-[11px] text-[#B8B1A6]">
              Today Unique:{' '}
              <span className="font-mono-tabular text-[#EAE6DF]">{todayUniqueVisitors}</span>
            </p>
          </div>
        </dl>

        {/* Main 2-Column Traffic Analytics Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Active Sessions Table + 14-Day / 24-Hour Traffic Chart */}
          <div className="space-y-8 lg:col-span-7">
            {/* Active Visitors Right Now */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                    Active Visitors Right Now ({onlineNow})
                  </h3>
                  <p className="mt-0.5 text-xs text-[#9C968B]">
                    Live presence synced via 20s heartbeats &amp; instant tab switch events
                  </p>
                </div>
                <span className="font-mono-tabular rounded border border-[#4F9E68]/40 bg-[#4F9E68]/10 px-2.5 py-1 text-[11px] font-semibold text-[#7AD696]">
                  {onlineNow} Online
                </span>
              </div>

              {!snapshot || snapshot.activeSessions.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#9C968B]">
                  Waiting for visitor telemetry from backend server...
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] text-[#9C968B] uppercase">
                        <th className="pb-2.5 font-medium">Visitor / IP</th>
                        <th className="pb-2.5 font-medium">Region</th>
                        <th className="pb-2.5 font-medium">Viewing Tab</th>
                        <th className="pb-2.5 font-medium">Client</th>
                        <th className="pb-2.5 text-right font-medium">Time Online</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {snapshot.activeSessions.map((session) => {
                        const isYou = session.sessionId === currentSessionId;
                        return (
                          <tr key={session.sessionId} className="text-[#EAE6DF]">
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full bg-[#4F9E68]"
                                  aria-hidden="true"
                                />
                                <span className="font-mono-tabular text-[11px]">
                                  {session.maskedIp}
                                </span>
                                {isYou && (
                                  <span className="rounded border border-[#C89B3C]/50 bg-[#C89B3C]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#C89B3C]">
                                    You
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="font-mono-tabular rounded border border-white/10 bg-[#0F0F12] px-2 py-0.5 text-[11px] text-[#D4CEC3]">
                                {session.country}
                              </span>
                            </td>
                            <td className="py-3 pr-3">
                              <p className="font-medium text-[#F6EFE2]">{session.currentTab}</p>
                              <p className="text-[10px] text-[#9C968B]">{session.currentSection}</p>
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-1.5 text-[11px] text-[#B8B1A6]">
                                <DeviceIcon type={session.deviceType} />
                                <span>
                                  {session.browser} · {session.os}
                                </span>
                              </div>
                            </td>
                            <td className="font-mono-tabular py-3 text-right text-[11px] text-[#C89B3C]">
                              {formatElapsed(session.connectedAt, serverTime)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Traffic History Chart */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                    Traffic Volume History
                  </h3>
                  <p className="mt-0.5 text-xs text-[#9C968B]">
                    Recorded real visitor views by day or UTC hour
                  </p>
                </div>

                <div className="flex rounded-md border border-white/10 bg-[#0F0F12] p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setChartRange('14d')}
                    className={`rounded px-2.5 py-1 transition-colors ${
                      chartRange === '14d'
                        ? 'bg-[#C89B3C] text-[#0B0B0D]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    14 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartRange('24h')}
                    className={`rounded px-2.5 py-1 transition-colors ${
                      chartRange === '24h'
                        ? 'bg-[#C89B3C] text-[#0B0B0D]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    24h Today (UTC)
                  </button>
                </div>
              </div>

              {chartRange === '14d' ? (
                <div className="mt-6">
                  <div className="flex h-36 items-end gap-1.5 border-b border-white/10 pb-2">
                    {(snapshot?.dailyHistory ?? []).map((point) => {
                      const pct = point.views > 0 ? Math.max(8, Math.round((point.views / dailyMax) * 100)) : 3;
                      return (
                        <div
                          key={point.date}
                          className="group flex flex-1 flex-col items-center justify-end gap-1"
                          title={`${point.date}: ${point.views} views (${point.uniqueVisitors} unique)`}
                        >
                          <span className="font-mono-tabular text-[10px] text-[#C89B3C] opacity-80 group-hover:opacity-100">
                            {point.views > 0 ? point.views : ''}
                          </span>
                          <div
                            className={`w-full rounded-t transition-all ${
                              point.views > 0 ? 'bg-[#C89B3C]' : 'bg-white/[0.06]'
                            }`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-[#9C968B]">
                    <span>
                      {snapshot?.dailyHistory[0]
                        ? formatShortDate(snapshot.dailyHistory[0].date)
                        : '--'}
                    </span>
                    <span>UTC Daily Page Views</span>
                    <span>
                      {snapshot?.dailyHistory.length
                        ? formatShortDate(
                            snapshot.dailyHistory[snapshot.dailyHistory.length - 1].date
                          )
                        : '--'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex h-36 items-end gap-1 border-b border-white/10 pb-2">
                    {(snapshot?.hourlyToday ?? []).map((point) => {
                      const pct = point.views > 0 ? Math.max(8, Math.round((point.views / hourlyMax) * 100)) : 3;
                      return (
                        <div
                          key={point.hour}
                          className="group flex flex-1 flex-col items-center justify-end gap-1"
                          title={`${String(point.hour).padStart(2, '0')}:00 UTC — ${point.views} views`}
                        >
                          <span className="font-mono-tabular text-[9px] text-[#4F9E68]">
                            {point.views > 0 ? point.views : ''}
                          </span>
                          <div
                            className={`w-full rounded-t transition-all ${
                              point.views > 0 ? 'bg-[#4F9E68]' : 'bg-white/[0.06]'
                            }`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-[#9C968B]">
                    <span>00:00 UTC</span>
                    <span>Hourly Traffic Today</span>
                    <span>23:00 UTC</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Traffic Breakdown + Recent Visitor Arrivals */}
          <div className="space-y-8 lg:col-span-5">
            {/* Breakdown Card */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6">
              <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                Audience Breakdown
              </h3>
              <div className="mt-3 grid grid-cols-4 gap-1 rounded-md border border-white/10 bg-[#0F0F12] p-1 text-[11px] font-semibold">
                {(
                  [
                    { id: 'sections', label: 'Sections' },
                    { id: 'countries', label: 'Regions' },
                    { id: 'devices', label: 'Clients' },
                    { id: 'referrers', label: 'Sources' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBreakdownTab(tab.id)}
                    className={`rounded px-2 py-1.5 transition-colors ${
                      breakdownTab === tab.id
                        ? 'bg-[#222228] text-[#F6EFE2]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {breakdownItems.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#9C968B]">No recorded entries yet.</p>
                ) : (
                  breakdownItems.map((item) => {
                    const widthPct = Math.max(6, Math.round((item.count / breakdownMax) * 100));
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="truncate font-medium text-[#EAE6DF]">{item.name}</span>
                          <span className="font-mono-tabular text-[#C89B3C]">
                            {item.count}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                          <div
                            className="h-full rounded-full bg-[#C89B3C]"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Arrivals Feed */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                  Recent Visitor Log
                </h3>
                <Clock className="h-4 w-4 text-[#9C968B]" aria-hidden="true" />
              </div>

              <ul className="mt-4 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-xs">
                {!snapshot || snapshot.recentVisitors.length === 0 ? (
                  <li className="py-4 text-center text-[#9C968B]">No recent visits logged yet.</li>
                ) : (
                  snapshot.recentVisitors.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-md border border-white/[0.06] bg-[#0F0F12] p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-tabular font-semibold text-[#EAE6DF]">
                          {entry.maskedIp} · {entry.country}
                        </span>
                        <span className="font-mono-tabular text-[10px] text-[#9C968B]">
                          {formatIsoTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#B8B1A6]">
                        {entry.tab} · {entry.deviceType} ({entry.browser} / {entry.os}) ·{' '}
                        <span className="text-[#C89B3C]">{entry.referrer}</span>
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Studio Ownership Lockup (Dimpz Games & Valdris Chronicle: Last Relic) */}
        <div className="mt-8 rounded-lg border border-white/10 bg-[#141417] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={GENERATED_ASSETS.studioLogo}
                alt="Dimpz Games Studio Emblem"
                referrerPolicy="no-referrer"
                className="h-12 w-16 rounded border border-[#C89B3C]/40 bg-[#08080A] object-cover"
              />
              <img
                src={GENERATED_ASSETS.gameLogo}
                alt="Valdris Chronicle: Last Relic Official Emblem"
                referrerPolicy="no-referrer"
                className="h-12 w-16 rounded border border-white/15 bg-[#08080A] object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-[#F6EFE2]">
                  {STUDIO_IDENTITY.studioName} · {STUDIO_IDENTITY.franchiseTitle}
                </p>
                <p className="mt-0.5 text-[11px] text-[#9C968B]">
                  Original IP &amp; Live GDD Master Architecture
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href={`mailto:${STUDIO_IDENTITY.contactEmail}`}
                className="inline-flex items-center gap-1.5 text-[#D4CEC3] hover:text-[#C89B3C]"
              >
                <Mail className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                <span>{STUDIO_IDENTITY.contactEmail}</span>
              </a>
              <a
                href={`mailto:${STUDIO_IDENTITY.secondaryEmail}`}
                className="inline-flex items-center gap-1.5 text-[#D4CEC3] hover:text-[#C89B3C]"
              >
                <Mail className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                <span>{STUDIO_IDENTITY.secondaryEmail}</span>
              </a>
              <a
                href={`tel:${STUDIO_IDENTITY.phone}`}
                className="font-mono-tabular inline-flex items-center gap-1.5 text-[#D4CEC3] hover:text-[#C89B3C]"
              >
                <Phone className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                <span>{STUDIO_IDENTITY.phoneDisplay}</span>
              </a>
              <a
                href={STUDIO_IDENTITY.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C89B3C] hover:underline"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Orb-lite/Game-Design-document</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
