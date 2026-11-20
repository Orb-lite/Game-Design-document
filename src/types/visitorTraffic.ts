export interface ActiveVisitorSession {
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
}

export interface RecentVisitorEntry {
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

export interface TrafficCountItem {
  name: string;
  count: number;
}

export interface DailyTrafficPoint {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface HourlyTrafficPoint {
  hour: number;
  views: number;
}

export interface VisitorTrafficSnapshot {
  serverTime: number;
  onlineNow: number;
  peakConcurrent: number;
  totalPageViews: number;
  uniqueVisitors: number;
  todayPageViews: number;
  todayUniqueVisitors: number;
  activeSessions: ActiveVisitorSession[];
  dailyHistory: DailyTrafficPoint[];
  hourlyToday: HourlyTrafficPoint[];
  sections: TrafficCountItem[];
  countries: TrafficCountItem[];
  devices: TrafficCountItem[];
  browsers: TrafficCountItem[];
  referrers: TrafficCountItem[];
  recentVisitors: RecentVisitorEntry[];
}
