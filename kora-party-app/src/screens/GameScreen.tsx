import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import QuestionRenderer from "../components/QuestionRenderer";
import FootballBackground from "../components/FootballBackground";
import GradientButton from "../components/GradientButton";
import {
  listenToSession,
  submitAnswer,
  advanceQuestion,
  setLevelTransition,
  advanceToLevel,
  checkAndTransferHost,
  FirebaseSession,
} from "../utils/sessionService";
import { buildQuestionSet, splitIntoLevels } from "../data";
import { BundleType } from "../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Game">;
  route: RouteProp<RootStackParamList, "Game">;
};

const SCORE_PER_CORRECT = 10;

export default function GameScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { playerId } = usePlayer();
  const { sessionId, bundles } = route.params;
  const progress = useRef(new Animated.Value(1)).current;
  const [session, setSession] = useState<FirebaseSession | null>(null);
  const [playersRanked, setPlayersRanked] = useState<any[]>([]);
  const [localAnswered, setLocalAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [submittedCorrect, setSubmittedCorrect] = useState(false);

  const isHost = session?.hostId === playerId;

  // Build question set once when seed arrives
  const questionsRef = useRef<{ type: BundleType; data: any }[][] | null>(null);
  if (!questionsRef.current && session?.seed && bundles?.length) {
    const allQs = buildQuestionSet(
      bundles as BundleType[],
      (session.questionCount || 30),
      session.seed
    );
    questionsRef.current = splitIntoLevels(allQs, 3);
  }

  const currentLevelQs = questionsRef.current?.[session?.currentLevel ?? 0] || [];

  // Subscribe to session
  useEffect(() => {
    const unsub = listenToSession(sessionId, (s) => {
      setSession(s);
      if (s) {
        const ranked = Object.values(s.players || {})
          .sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
        setPlayersRanked(ranked);
        checkAndTransferHost(sessionId);
      }
    });
    return unsub;
  }, [sessionId]);

  const myScore = session?.players?.[playerId]?.score || 0;
  const currentQuestion =
    questionsRef.current?.[session?.currentLevel ?? 0]?.[
      session?.currentQuestionIndex ?? 0
    ] || null;

  // Timer driven by Firebase phaseStartedAt
  const [timeLeft, setTimeLeft] = useState(15);
  useEffect(() => {
    if (!session || session.status !== "playing" || !currentQuestion) return;
    const startedAt = session.phaseStartedAt || Date.now();
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    let remaining = 15 - elapsed;
    if (remaining < 0) remaining = 0;
    setTimeLeft(remaining);

    const interval = setInterval(() => {
      const e = Math.floor((Date.now() - session.phaseStartedAt) / 1000);
      const rem = Math.max(0, 15 - e);
      setTimeLeft(rem);
      if (rem <= 0) {
        clearInterval(interval);
        setLocalAnswered(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.phaseStartedAt, session?.currentLevel, session?.currentQuestionIndex, currentQuestion?.data?.id]);

  // Reset answered state on new question
  useEffect(() => {
    setLocalAnswered(false);
    setSelectedAnswer(null);
    setTextInput("");
    setSubmittedCorrect(false);
  }, [session?.currentLevel, session?.currentQuestionIndex]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: timeLeft / 15,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const timerColor =
    timeLeft > 10 ? "#4CAF50" : timeLeft > 5 ? "#FFC107" : "#E53935";

  const isTextType = ["guess-by-silhouette", "complete-the-lineup"].includes(
    currentQuestion?.type || ""
  );

  const doSubmit = async (answer: string) => {
    if (localAnswered || !session || !currentQuestion) return;

    const type = currentQuestion.type;
    const data = currentQuestion.data;
    let isCorrect = false;
    const lower = answer.toLowerCase().trim();

    if (type === "true-or-false") {
      isCorrect = (data.answer ? "true" : "false") === lower;
    } else if (type === "guess-the-nation") {
      isCorrect = lower === (data.correctNation || data.answer || "").toLowerCase().trim();
    } else if (type === "higher-or-lower") {
      isCorrect = lower === (data.correctAnswer || "").toLowerCase().trim();
    } else {
      const accepted = (data.acceptedAnswers || data.options || []).map(
        (a: string) => String(a).toLowerCase().trim()
      );
      isCorrect = accepted.includes(lower) || lower.includes(data.answer?.toLowerCase().trim());
    }

    const newScore = isCorrect ? myScore + SCORE_PER_CORRECT : myScore;
    await submitAnswer(
      sessionId,
      playerId,
      `${session.currentLevel}-${session.currentQuestionIndex}`,
      isCorrect,
      newScore
    );
    setSubmittedCorrect(isCorrect);
    setLocalAnswered(true);
  };

  const handleAnswer = async (answer: string) => {
    if (localAnswered) return;
    if (isTextType) {
      // text input: just track in-progress text; submit via button
      setTextInput(answer);
      return;
    }
    setSelectedAnswer(answer);
    await doSubmit(answer);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    await doSubmit(textInput);
  };

  // Host advances (calls when timer runs out or after showing result)
  const hostAdvance = async () => {
    if (!isHost || !session) return;
    const levelQs = questionsRef.current?.[session.currentLevel] || [];
    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex < levelQs.length) {
      await advanceQuestion(sessionId, session.currentLevel, nextIndex);
    } else {
      const nextLevel = session.currentLevel + 1;
      if (questionsRef.current?.[nextLevel]) {
        await setLevelTransition(sessionId, nextLevel);
      } else {
        // game over
        const { endSession } = await import("../utils/sessionService");
        await endSession(sessionId);
      }
    }
  };

  // When host sees level-transition, start next level after short delay
  useEffect(() => {
    if (session?.status === "level-transition" && isHost) {
      const timer = setTimeout(async () => {
        await advanceToLevel(sessionId, session.currentLevel);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [session?.status, isHost]);

  // When finished, navigate to results
  useEffect(() => {
    if (session?.status === "finished") {
      navigation.replace("Result", { sessionId });
    }
  }, [session?.status]);

  if (!session || !currentQuestion || !questionsRef.current) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-textMuted">Loading game...</Text>
      </SafeAreaView>
    );
  }

  const qCount = currentLevelQs.length;

  return (
    <SafeAreaView className="flex-1">
      <FootballBackground>
      <View className="flex-1 px-5 pt-2">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#6B6B8D" />
          </TouchableOpacity>
          <Text className="text-textMuted text-sm">
            {t("level")} {(session.currentLevel || 0) + 1} • {t("question")}{" "}
            {(session.currentQuestionIndex || 0) + 1} {t("of")} {qCount}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="football" size={16} color="#FFC107" />
            <Text className="text-accent text-sm font-bold ml-1">{myScore}</Text>
          </View>
        </View>

        {/* Live leaderboard mini */}
        {playersRanked.length > 1 && (
          <View className="flex-row gap-2 mb-2 justify-center">
            {playersRanked.slice(0, 3).map((p: any, i: number) => (
              <View
                key={p.id}
                className="bg-surfaceCard rounded-full px-3 py-1 flex-row items-center"
              >
                <Text className="text-textMuted text-xs mr-1">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </Text>
                <Text className="text-text text-xs font-semibold">{p.name}</Text>
                <Text className="text-accent text-xs font-bold ml-1">{p.score}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Timer Progress Bar */}
        <View className="bg-surface rounded-full h-2 mb-2 overflow-hidden">
          <Animated.View
            className="h-full rounded-full"
            style={{
              backgroundColor: timerColor,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>

        {/* Timer Number */}
        <View className="items-center mb-3">
          <Text className="text-textMuted text-3xl font-bold">
            {String(timeLeft).padStart(2, "0")}
          </Text>
        </View>

        {/* Question */}
        <View className="flex-1">
          <QuestionRenderer
            type={currentQuestion.type}
            data={currentQuestion.data}
            selectedAnswer={isTextType ? textInput : selectedAnswer}
            showResult={localAnswered}
            onSelect={(answer) => handleAnswer(answer)}
            lang={lang}
          />
        </View>

        {/* Text-input submit (any player) */}
        {isTextType && !localAnswered && (
          <TouchableOpacity
            onPress={handleTextSubmit}
            disabled={!textInput.trim()}
            className={`rounded-2xl py-4 items-center mb-2 ${
              textInput.trim() ? "bg-primary" : "bg-surfaceLighter"
            }`}
            activeOpacity={0.8}
          >
            <Text className={`text-lg font-bold ${textInput.trim() ? "text-white" : "text-textMuted"}`}>
              {lang === "en" ? "Submit" : "إرسال"}
            </Text>
          </TouchableOpacity>
        )}

        {isTextType && localAnswered && (
          <View className="mb-2 items-center">
            <Text className={`text-lg font-bold ${submittedCorrect ? "text-success" : "text-error"}`}>
              {submittedCorrect
                ? lang === "en" ? "Correct ✓" : "صحيح ✓"
                : lang === "en" ? "Wrong ✗" : "خطأ ✗"}
            </Text>
          </View>
        )}

        {/* Answer submitted indicator */}
        {localAnswered && (
          <View className="mb-4 items-center">
            <Text className="text-success text-lg font-bold">
              {lang === "en" ? "Answer submitted ✓" : "تم إرسال الإجابة ✓"}
            </Text>
            <Text className="text-textMuted text-xs mt-1">
              {lang === "en"
                ? "Waiting for other players..."
                : "في انتظار اللاعبين الآخرين..."}
            </Text>
          </View>
        )}

        {/* Next (host only, after time out) */}
        {isHost && timeLeft <= 0 && (
          <GradientButton
            onPress={hostAdvance}
            label={lang === "en" ? "Next" : "التالي"}
            className="mb-4"
          />
        )}
      </View>
      </FootballBackground>
    </SafeAreaView>

  );
}
