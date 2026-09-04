import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLang } from "../context/LangContext";
import FootballBackground from "../components/FootballBackground";
import QuestionRenderer from "../components/QuestionRenderer";
import { buildQuestionSet, checkAnswer } from "../data";
import { getAllBundleTypes } from "../data";
import { loadStreak, markDailyCompleted, StreakState } from "../utils/streakService";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "DailyChallenge">;
};

const QUESTIONS_COUNT = 10;
const TIMER_SECONDS = 15;
const SCORE_PER_CORRECT = 10;

function dailySeed(): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return y * 10000 + m * 100 + d;
}

export default function DailyChallengeScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const [phase, setPhase] = useState<"intro" | "playing" | "finished">("intro");
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  useEffect(() => {
    loadStreak().then(setStreak);
  }, []);

  const questions = useMemo(
    () => buildQuestionSet(getAllBundleTypes(), QUESTIONS_COUNT, dailySeed()),
    []
  );

  const currentQ = questions[questionIndex] || null;
  const isTextType = ["guess-by-silhouette", "complete-the-lineup"].includes(
    currentQ?.type || ""
  );

  useEffect(() => {
    if (phase !== "playing" || revealed) return;
    setTimeLeft(TIMER_SECONDS);
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, questionIndex, revealed]);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0 && !revealed) {
      setRevealed(true);
    }
  }, [timeLeft, phase, revealed]);

  const submit = (answer: string) => {
    if (!currentQ || revealed) return;
    const correct = checkAnswer(currentQ.type, currentQ.data, answer);
    setSelected(answer);
    setRevealed(true);
    if (correct) {
      setScore((s) => s + SCORE_PER_CORRECT);
      setCorrectCount((c) => c + 1);
    }
  };

  const next = async () => {
    if (questionIndex + 1 >= questions.length) {
      // finished
      const updated = await markDailyCompleted();
      setStreak(updated);
      setPhase("finished");
    } else {
      setQuestionIndex((i) => i + 1);
      setSelected(null);
      setTextInput("");
      setRevealed(false);
    }
  };

  const timerColor =
    timeLeft > 10 ? "#4CAF50" : timeLeft > 5 ? "#FFC107" : "#E53935";

  if (phase === "intro") {
    return (
      <SafeAreaView className="flex-1">
        <FootballBackground>
          <View className="flex-1 px-6 pt-4">
            <View className="flex-row items-center mb-8">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-text text-xl font-bold">{t("dailyChallenge")}</Text>
            </View>

            <View className="bg-surfaceCard rounded-3xl p-8 items-center border border-border mb-6">
              <View className="bg-accent/20 rounded-full w-20 h-20 items-center justify-center mb-4">
                <Ionicons name="trophy" size={40} color="#FFC107" />
              </View>
              <Text className="text-text text-2xl font-bold text-center mb-2">
                {lang === "en" ? "Daily Challenge" : "تحدي اليوم"}
              </Text>
              <Text className="text-textMuted text-center mb-6">
                {lang === "en"
                  ? `${QUESTIONS_COUNT} questions, ${TIMER_SECONDS}s each. Complete today to keep your streak!`
                  : `أسئلة، ${TIMER_SECONDS} ثانية لكل سؤال. أكمل اليوم للحفاظ على سلسلتك!`}
              </Text>

              <View className="flex-row gap-4">
                <View className="bg-surfaceLighter rounded-2xl px-6 py-4 items-center">
                  <Text className="text-accent text-3xl font-bold">
                    {streak?.current ?? 0}
                  </Text>
                  <Text className="text-textMuted text-xs mt-1">
                    {lang === "en" ? "Day streak" : "سلسلة الأيام"}
                  </Text>
                </View>
                <View className="bg-surfaceLighter rounded-2xl px-6 py-4 items-center">
                  <Text className="text-primary text-3xl font-bold">
                    {streak?.best ?? 0}
                  </Text>
                  <Text className="text-textMuted text-xs mt-1">
                    {lang === "en" ? "Best streak" : "أفضل سلسلة"}
                  </Text>
                </View>
              </View>

              {streak?.completed && (
                <Text className="text-success mt-6 font-bold">
                  {lang === "en"
                    ? "✓ Completed today. Come back tomorrow!"
                    : "✓ أُكمل اليوم. عد غداً!"}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setPhase("playing")}
              disabled={streak?.completed}
              activeOpacity={0.85}
              className="self-center rounded-2xl overflow-hidden"
              style={{
                height: 60,
                paddingHorizontal: 48,
                opacity: streak?.completed ? 0.4 : 1,
                backgroundColor: streak?.completed ? "#666" : "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-white text-xl font-extrabold">
                {streak?.completed
                  ? lang === "en" ? "Done for today" : "انتهى اليوم"
                  : lang === "en" ? "Start Challenge" : "ابدأ التحدي"}
              </Text>
            </TouchableOpacity>
          </View>
        </FootballBackground>
      </SafeAreaView>
    );
  }

  if (phase === "finished") {
    return (
      <SafeAreaView className="flex-1">
        <FootballBackground>
          <View className="flex-1 px-6 pt-4 items-center justify-center">
            <View className="bg-surfaceCard rounded-3xl p-8 items-center w-full border border-border">
              <View className="bg-accent/20 rounded-full w-24 h-24 items-center justify-center mb-4">
                <Ionicons name="trophy" size={48} color="#FFC107" />
              </View>
              <Text className="text-accent text-3xl font-bold">
                {lang === "en" ? "Challenge Complete!" : "اكتمل التحدي!"}
              </Text>
              <Text className="text-text text-xl mt-2">
                {score} {lang === "en" ? "points" : "نقطة"}
              </Text>
              <Text className="text-textMuted mt-1">
                {correctCount}/{QUESTIONS_COUNT}{" "}
                {lang === "en" ? "correct" : "صحيحة"}
              </Text>

              <View className="flex-row gap-4 mt-6">
                <View className="bg-surfaceLighter rounded-2xl px-6 py-4 items-center">
                  <Text className="text-accent text-3xl font-bold">
                    {streak?.current ?? 0}
                  </Text>
                  <Text className="text-textMuted text-xs mt-1">
                    {lang === "en" ? "Day streak" : "سلسلة الأيام"}
                  </Text>
                </View>
                <View className="bg-surfaceLighter rounded-2xl px-6 py-4 items-center">
                  <Text className="text-primary text-3xl font-bold">
                    {streak?.best ?? 0}
                  </Text>
                  <Text className="text-textMuted text-xs mt-1">
                    {lang === "en" ? "Best streak" : "أفضل سلسلة"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
                className="self-center rounded-2xl overflow-hidden mt-8"
                style={{
                  height: 56,
                  paddingHorizontal: 48,
                  backgroundColor: "#4CAF50",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white text-lg font-bold">
                  {t("backToHome")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FootballBackground>
      </SafeAreaView>
    );
  }

  if (!currentQ) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#FFC107" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FootballBackground>
        <View className="flex-1 px-5 pt-2">
          {/* Top bar */}
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#6B6B8D" />
            </TouchableOpacity>
            <Text className="text-textMuted text-sm">
              {t("question")} {questionIndex + 1} {t("of")} {questions.length}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="football" size={16} color="#FFC107" />
              <Text className="text-accent text-sm font-bold ml-1">{score}</Text>
            </View>
          </View>

          {/* Timer bar */}
          <View className="bg-surface rounded-full h-2 mb-2 overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: timerColor,
                width: `${(timeLeft / TIMER_SECONDS) * 100}%`,
              }}
            />
          </View>
          <View className="items-center mb-3">
            <Text className="text-textMuted text-3xl font-bold">
              {String(timeLeft).padStart(2, "0")}
            </Text>
          </View>

          {/* Question */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <QuestionRenderer
              type={currentQ.type}
              data={currentQ.data}
              selectedAnswer={isTextType ? textInput : selected}
              showResult={revealed}
              onSelect={(answer) => {
                if (isTextType) {
                  setTextInput(answer);
                } else {
                  submit(answer);
                }
              }}
              lang={lang}
            />
          </ScrollView>

          {/* Text submit / next */}
          {isTextType && !revealed && (
            <TouchableOpacity
              onPress={() => submit(textInput)}
              disabled={!textInput.trim()}
              activeOpacity={0.85}
              className="self-center rounded-2xl overflow-hidden mt-3"
              style={{
                height: 52,
                paddingHorizontal: 40,
                opacity: textInput.trim() ? 1 : 0.4,
                backgroundColor: "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-white text-lg font-bold">{t("submit")}</Text>
            </TouchableOpacity>
          )}

          {revealed && (
            <TouchableOpacity
              onPress={next}
              activeOpacity={0.85}
              className="self-center rounded-2xl overflow-hidden mt-3"
              style={{
                height: 56,
                paddingHorizontal: 48,
                backgroundColor: "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-white text-lg font-extrabold">
                {questionIndex + 1 >= questions.length
                  ? lang === "en" ? "Finish" : "إنهاء"
                  : t("next")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
