import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Game">;
  route: RouteProp<RootStackParamList, "Game">;
};

const QUESTION = {
  id: "gtp001",
  clue: "Argentine forward, won 8 Ballon d'Or awards, captained his country to the 2022 World Cup title, played for Barcelona, PSG, and Inter Miami.",
  clueAr: "مهاجم أرجنتيني، فاز بالكرة الذهبية 8 مرات، وقاد منتخب بلاده إلى لقب كأس العالم 2022، ولعب مع برشلونة وباريس سان جيرمان وإنتر ميامي.",
  answer: "Lionel Messi",
  options: ["Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappe"],
};

const TIMER_MAX = 15;

export default function GameScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { sessionId } = route.params;
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const progress = new Animated.Value(timeLeft / TIMER_MAX);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: timeLeft / TIMER_MAX,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const timerColor =
    timeLeft > 10 ? "#4CAF50" : timeLeft > 5 ? "#FFC107" : "#E53935";

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-2">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#6B6B8D" />
          </TouchableOpacity>
          <Text className="text-textMuted text-sm">
            {t("level")} 1 • {t("question")} 1 {t("of")} 10
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="football" size={16} color="#FFC107" />
            <Text className="text-accent text-sm font-bold ml-1">0</Text>
          </View>
        </View>

        {/* Timer */}
        <View className="bg-surface rounded-full h-2 mb-6 overflow-hidden">
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

        <View className="items-center mb-4">
          <Text className="text-textMuted text-4xl font-bold">
            {String(timeLeft).padStart(2, "0")}
          </Text>
        </View>

        {/* Question Card */}
        <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary/20 rounded-lg px-3 py-1">
              <Text className="text-primary text-xs font-bold">
                {lang === "en" ? "GUESS THE PLAYER" : "خمن اللاعب"}
              </Text>
            </View>
          </View>
          <Text className="text-text text-lg leading-6">
            {lang === "en" ? QUESTION.clue : QUESTION.clueAr}
          </Text>
        </View>

        {/* Options */}
        <View className="flex-1">
          {QUESTION.options.map((option, index) => {
            const isSelected = selected === option;
            const isCorrect = option === QUESTION.answer;
            let borderColor = "border-border";
            let bgColor = "bg-surfaceCard";
            if (showResult && isSelected && isCorrect) {
              borderColor = "border-success";
              bgColor = "bg-success/10";
            } else if (showResult && isSelected && !isCorrect) {
              borderColor = "border-danger";
              bgColor = "bg-danger/10";
            } else if (showResult && isCorrect) {
              borderColor = "border-success";
              bgColor = "bg-success/10";
            } else if (isSelected) {
              borderColor = "border-primary";
              bgColor = "bg-primary/10";
            }

            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelect(option)}
                className={`rounded-2xl p-4 mb-3 border ${borderColor} ${bgColor}`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-surface items-center justify-center mr-3">
                    <Text className="text-textSecondary text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text className="text-text font-semibold flex-1">{option}</Text>
                  {showResult && isCorrect && (
                    <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <Ionicons name="close-circle" size={22} color="#E53935" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Result Button */}
        {showResult && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Result", { sessionId })}
            className="bg-primary rounded-2xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold">
              {selected === QUESTION.answer ? t("correct") : t("wrong")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
