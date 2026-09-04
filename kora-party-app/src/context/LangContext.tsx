import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ar";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  appName: { en: "Kora Party", ar: "كورة بارتي" },
  play: { en: "Play", ar: "ابدأ" },
  createGame: { en: "Create Game", ar: "إنشاء مباراة" },
  joinGame: { en: "Join Game", ar: "الانضمام لمباراة" },
  dailyChallenge: { en: "Daily Challenge", ar: "تحدي اليوم" },
  leaderboard: { en: "Leaderboard", ar: "لوحة الصدارة" },
  settings: { en: "Settings", ar: "الإعدادات" },
  enterSessionCode: { en: "Enter Session Code", ar: "أدخل رمز المباراة" },
  join: { en: "Join", ar: "انضم" },
  start: { en: "Start", ar: "ابدأ" },
  waitingForPlayers: { en: "Waiting for players...", ar: "في انتظار اللاعبين..." },
  players: { en: "Players", ar: "اللاعبين" },
  score: { en: "Score", ar: "النتيجة" },
  correct: { en: "Correct!", ar: "صحيح!" },
  wrong: { en: "Wrong!", ar: "خطأ!" },
  timeUp: { en: "Time's Up!", ar: "انتهى الوقت!" },
  levelComplete: { en: "Level Complete!", ar: "اكتملت المرحلة!" },
  gameOver: { en: "Game Over!", ar: "انتهت المباراة!" },
  winner: { en: "Winner", ar: "الفائز" },
  playAgain: { en: "Play Again", ar: "العب مرة أخرى" },
  backToHome: { en: "Back to Home", ar: "العودة للرئيسية" },
  selectBundles: { en: "Select Bundles", ar: "اختر الأسئلة" },
  shareCode: { en: "Share Code", ar: "شارك الرمز" },
  level: { en: "Level", ar: "المرحلة" },
  question: { en: "Question", ar: "السؤال" },
  of: { en: "of", ar: "من" },
  true: { en: "True", ar: "صح" },
  false: { en: "False", ar: "خطأ" },
  higherOrLower: { en: "Higher or Lower", ar: "أعلى أو أقل" },
  submit: { en: "Submit", ar: "إرسال" },
  next: { en: "Next", ar: "التالي" },
  host: { en: "Host", ar: "المضيف" },
  guest: { en: "Guest", ar: "ضيف" },
  disconnected: { en: "Host disconnected. New host assigned.", ar: "انقطع اتصال المضيف. تم تعيين مضيف جديد." },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
