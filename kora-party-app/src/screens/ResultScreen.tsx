import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Result">;
  route: RouteProp<RootStackParamList, "Result">;
};

const RESULTS = [
  { id: "1", name: "Ahmed", score: 80, correct: 8 },
  { id: "2", name: "Omar", score: 60, correct: 6 },
  { id: "3", name: "Sara", score: 50, correct: 5 },
];

export default function ResultScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { sessionId } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-4">
        {/* Trophy */}
        <View className="items-center mb-6">
          <View className="bg-accent/20 rounded-full w-24 h-24 items-center justify-center mb-4">
            <Ionicons name="trophy" size={56} color="#FFC107" />
          </View>
          <Text className="text-accent text-3xl font-bold">{t("gameOver")}</Text>
        </View>

        {/* Winner Card */}
        <View className="bg-surfaceCard rounded-3xl p-6 items-center mb-6 border border-border">
          <Text className="text-textMuted text-sm mb-2">{t("winner")}</Text>
          <Text className="text-primary text-2xl font-bold mb-1">
            {RESULTS[0].name}
          </Text>
          <Text className="text-accent text-4xl font-bold">
            {RESULTS[0].score} pts
          </Text>
          <Text className="text-textMuted text-sm mt-1">
            {RESULTS[0].correct}/10 {lang === "en" ? "correct" : "صحيحة"}
          </Text>
        </View>

        {/* Leaderboard */}
        <Text className="text-text font-bold mb-3">{t("leaderboard")}</Text>
        <FlatList
          data={RESULTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View className="bg-surfaceCard rounded-2xl p-4 mb-2 flex-row items-center border border-border">
              <Text className="text-textMuted font-bold w-8 text-center">
                #{index + 1}
              </Text>
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mx-3">
                <Text className="text-primary font-bold text-sm">
                  {item.name.charAt(0)}
                </Text>
              </View>
              <Text className="text-text font-semibold flex-1">{item.name}</Text>
              <Text className="text-accent font-bold text-lg">{item.score}</Text>
            </View>
          )}
        />

        {/* Actions */}
        <View className="mt-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Game", { sessionId })}
            className="bg-primary rounded-2xl py-4 items-center mb-3"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold">{t("playAgain")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="bg-surfaceLighter rounded-2xl py-4 items-center border border-border"
            activeOpacity={0.8}
          >
            <Text className="text-textSecondary text-lg font-bold">{t("backToHome")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
