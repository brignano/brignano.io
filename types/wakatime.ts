export interface WakaTimeLanguage {
  name: string;
  total_seconds?: number;
  seconds?: number;
}

export interface WakaTimeCategory {
  name: string;
  total_seconds?: number;
  seconds?: number;
}

export interface WakaTimeAllTimeStats {
  languages?: WakaTimeLanguage[];
  categories?: WakaTimeCategory[];
  // Already present in the stats/all_time response — surfaced at zero extra API cost.
  editors?: WakaTimeLanguage[];
  operating_systems?: WakaTimeLanguage[];
  projects?: WakaTimeLanguage[];
  machines?: WakaTimeLanguage[];
  dependencies?: WakaTimeLanguage[];
  best_day?: {
    date: string;
    text: string;
    total_seconds: number;
  } | null;
  human_readable_total_including_other_language?: string;
  human_readable_daily_average_including_other_language?: string;
  human_readable_daily_average?: string;
  human_readable_range?: string;
  days_including_holidays?: number;
}

export interface WakaTimeSummariesEntry {
  range: { date: string; text?: string };
  grand_total: { total_seconds: number; text?: string };
}

export interface WakaTimeSummaries {
  data: WakaTimeSummariesEntry[];
}

export interface WakaTimeUser {
  last_heartbeat?: {
    language?: string;
    entity?: string;
    branch?: string;
    branch_name?: string;
  };
  last_heartbeat_at?: {
    language?: string;
    entity?: string;
    branch?: string;
  };
  last_language?: string;
  language?: string;
  preferred_language?: string;
  last_branch?: string;
  url?: string;
  profile_url?: string;
  username?: string;
}

export interface WakaTimeApiResponse<T> {
  data: T;
}

export interface StatsData {
  name: string;
  seconds: number;
}
