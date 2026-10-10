// Site-wide daily cap on chat requests, so a flood of traffic (or many IPs)
// can't run up the Anthropic bill. The count lives in Upstash Redis (or Vercel
// KV, which is Upstash under the hood) when one is connected, which makes it
// shared across every function instance. Without one — or if Redis is
// unreachable — it falls back to a per-instance count, which is weaker but
// still bounds each instance.

const DEFAULT_DAILY_LIMIT = 300;
const REDIS_TIMEOUT_MS = 2000;
// Keys are per UTC day; keep each one a little past its day, then let it go.
const KEY_TTL_SECONDS = 2 * 24 * 60 * 60;

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

let local = { day: "", count: 0 };

function dailyLimit() {
  const raw = process.env.CHAT_DAILY_LIMIT?.trim();
  const value = raw ? Number(raw) : NaN;
  return Number.isInteger(value) && value >= 0 ? value : DEFAULT_DAILY_LIMIT;
}

function countLocally(day: string) {
  if (local.day !== day) local = { day, count: 0 };
  return ++local.count;
}

async function countInRedis(day: string): Promise<number> {
  const key = `chat:requests:${day}`;
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, KEY_TTL_SECONDS],
    ]),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const [incr] = (await res.json()) as { result?: unknown; error?: string }[];
  if (typeof incr?.result !== "number")
    throw new Error(incr?.error ?? "Unexpected Redis reply");
  return incr.result;
}

/**
 * Counts one chat request against today's budget. Returns false once the
 * day's limit is used up.
 */
export async function takeFromDailyBudget(): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  let count: number;
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      count = await countInRedis(day);
    } catch (error) {
      console.error("chat: daily budget check failed, counting locally", error);
      count = countLocally(day);
    }
  } else {
    count = countLocally(day);
  }
  return count <= dailyLimit();
}
