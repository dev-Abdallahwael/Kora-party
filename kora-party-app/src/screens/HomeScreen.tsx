import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  const { lang, toggleLang, t } = useLang();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-6 pt-4 pb-8">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-text text-3xl font-bold">{t("appName")}</Text>
            <Text className="text-textMuted text-sm mt-1">
              Football Trivia
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleLang}
            className="bg-surfaceLight rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-accent text-sm font-bold">
              {lang === "en" ? "عر" : "EN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border">
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="football" size={48} color="#1B5E20" />
            </View>
            <Text className="text-text text-2xl font-bold text-center">
              {lang === "en" ? "Test Your Football Knowledge" : "اختبر معرفتك بالكرة"}
            </Text>
            <Text className="text-textSecondary text-sm text-center mt-2">
              {lang === "en"
                ? "Challenge friends in real-time trivia"
                : "تحدى أصدقائك في مسابقات مباشرة"}
            </Text>
          </View>

          {/* Create Game Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateGame")}
            className="bg-primary rounded-2xl py-4 px-6 mb-3 items-center"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">
                {t("createGame")}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Join Game Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("JoinGame")}
            className="bg-surfaceLighter rounded-2xl py-4 px-6 items-center border border-border"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-in" size={24} color="#FFC107" />
              <Text className="text-accent text-lg font-bold ml-3">
                {t("joinGame")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          className="bg-surface rounded-2xl p-4 border border-border mb-4"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <View className="bg-accent/20 rounded-xl w-12 h-12 items-center justify-center">
              <Ionicons name="trophy" size={24} color="#FFC107" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-text font-bold">{t("dailyChallenge")}</Text>
              <Text className="text-textMuted text-xs mt-1">
                {lang === "en" ? "Play solo & earn streaks" : "العب وحيداً واجمع السلاسل"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B6B8D" />
          </View>
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity
          className="bg-surface rounded-2xl p-4 border border-border"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <View className="bg-primary/20 rounded-xl w-12 h-12 items-center justify-center">
              <Ionicons name="stats-chart" size={24} color="#1B5E20" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-text font-bold">{t("leaderboard")}</Text>
              <Text className="text-textMuted text-xs mt-1">
                {lang === "en" ? "See top players" : "شاهد أفضل اللاعبين"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B6B8D" />
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View className="flex-1 justify-end items-center">
          <Text className="text-textMuted text-xs">
            {lang === "en"
              ? "Play with 7 bundle types • Bilingual EN/AR"
              : "7 أنواع أسئلة • ثنائية اللغة"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
