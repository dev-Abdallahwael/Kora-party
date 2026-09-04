import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "kora_daily_streak";
const LAST_KEY = "kora_daily_last_completed";

export interface StreakState {
  current: number;
  best: number;
  completed: boolean;
  lastCompletedDate: string | null;
}

function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = new Date(ay, am - 1, ad);
  const db = new Date(by, bm - 1, bd);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export async function loadStreak(): Promise<StreakState> {
  try {
    const [currentRaw, bestRaw, lastRaw] = await AsyncStorage.multiGet([
      STREAK_KEY,
      "kora_daily_best",
      LAST_KEY,
    ]);
    const current = Number(currentRaw[1] || 0);
    const best = Number(bestRaw[1] || 0);
    const last = lastRaw[1];
    const today = todayKey();

    // If last completed is not today nor yesterday, reset the streak.
    if (last && last !== today && last !== yesterdayKey()) {
      return { current: 0, best, completed: false, lastCompletedDate: last };
    }
    return {
      current,
      best,
      completed: last === today,
      lastCompletedDate: last,
    };
  } catch {
    return { current: 0, best: 0, completed: false, lastCompletedDate: null };
  }
}

export async function markDailyCompleted(): Promise<StreakState> {
  const state = await loadStreak();
  if (state.completed) return state;

  const today = todayKey();
  const fromYesterday = state.lastCompletedDate === yesterdayKey();
  const next = fromYesterday ? state.current + 1 : 1;
  const best = Math.max(state.best, next);

  await AsyncStorage.multiSet([
    [STREAK_KEY, String(next)],
    ["kora_daily_best", String(best)],
    [LAST_KEY, today],
  ]);

  return {
    current: next,
    best,
    completed: true,
    lastCompletedDate: today,
  };
}

export async function resetStreakUi() {
  // no-op helper kept for symmetry
}
