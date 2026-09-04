import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { useGameEngine } from "../hooks/useGameEngine";
import QuestionRenderer from "../components/QuestionRenderer";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Game">;
  route: RouteProp<RootStackParamList, "Game">;
};

export default function GameScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { sessionId, bundles } = route.params as any;
  const engine = useGameEngine();
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (bundles && engine.status === "setup") {
      engine.startGame(bundles);
    }
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: engine.timeLeft / engine.timerMax,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [engine.timeLeft]);

  const timerColor =
    engine.timeLeft > 10
      ? "#4CAF50"
      : engine.timeLeft > 5
        ? "#FFC107"
        : "#E53935";

  const questionsPerLevel = engine.questions[engine.currentLevel]?.length || 10;

  // Level Transition Overlay
  if (engine.status === "level-transition") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-surfaceCard rounded-3xl p-10 items-center border border-border">
            <View className="bg-primary/20 rounded-full w-24 h-24 items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={56} color="#4CAF50" />
            </View>
            <Text className="text-accent text-3xl font-bold mb-2">
              {t("levelComplete")}
            </Text>
            <Text className="text-textSecondary text-lg mb-1">
              {t("level")} {engine.currentLevel}
            </Text>
            <Text className="text-accent text-4xl font-bold mb-8">
              {engine.score} pts
            </Text>
            <TouchableOpacity
              onPress={engine.startNextLevel}
              className="bg-primary rounded-2xl py-4 px-10"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold">
                {t("level")} {engine.currentLevel + 1}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Game Over
  if (engine.status === "finished") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-surfaceCard rounded-3xl p-10 items-center border border-border">
            <View className="bg-accent/20 rounded-full w-24 h-24 items-center justify-center mb-6">
              <Ionicons name="trophy" size={56} color="#FFC107" />
            </View>
            <Text className="text-accent text-3xl font-bold mb-2">
              {t("gameOver")}
            </Text>
            <Text className="text-textSecondary text-lg mb-1">
              {engine.answers.filter((a) => a.correct).length}/
              {engine.totalQuestions} {lang === "en" ? "correct" : "صحيحة"}
            </Text>
            <Text className="text-accent text-5xl font-bold mb-8">
              {engine.score} pts
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Result", { sessionId, bundles })
              }
              className="bg-primary rounded-2xl py-4 px-10 mb-3"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold">{t("playAgain")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              className="py-3"
            >
              <Text className="text-textMuted">{t("backToHome")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!engine.currentQuestion) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-2">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#6B6B8D" />
          </TouchableOpacity>
          <Text className="text-textMuted text-sm">
            {t("level")} {engine.currentLevel + 1} • {t("question")}{" "}
            {engine.currentQuestionIndex + 1} {t("of")} {questionsPerLevel}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="football" size={16} color="#FFC107" />
            <Text className="text-accent text-sm font-bold ml-1">
              {engine.score}
            </Text>
          </View>
        </View>

        {/* Timer Progress Bar */}
        <View className="bg-surface rounded-full h-2 mb-4 overflow-hidden">
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
        <View className="items-center mb-4">
          <Text className="text-textMuted text-4xl font-bold">
            {String(engine.timeLeft).padStart(2, "0")}
          </Text>
        </View>

        {/* Question */}
        <View className="flex-1">
          <QuestionRenderer
            type={engine.currentQuestion.type}
            data={engine.currentQuestion.data}
            selectedAnswer={engine.selectedAnswer}
            showResult={engine.showResult}
            onSelect={(answer: string) => {
              if (!engine.isAnswered) {
                engine.submitAnswer(answer);
              }
            }}
            lang={lang}
          />
        </View>

        {/* Next / Result Button */}
        {engine.showResult && (
          <TouchableOpacity
            onPress={() => {
              engine.nextQuestion();
            }}
            className="bg-primary rounded-2xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold">
              {(engine.status as string) === "level-transition" ? t("level") : lang === "en" ? "Next" : "التالي"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
