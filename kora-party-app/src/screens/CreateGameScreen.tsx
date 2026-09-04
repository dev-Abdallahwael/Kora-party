import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import { createSession } from "../utils/sessionService";
import { BundleType } from "../types";
import FootballBackground from "../components/FootballBackground";
import GradientButton from "../components/GradientButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateGame">;
};

const BUNDLES = [
  { id: "guess-the-player", icon: "person" as const, color: "#1B5E20" },
  { id: "guess-by-history", icon: "time" as const, color: "#FFC107" },
  { id: "guess-the-nation", icon: "globe" as const, color: "#E53935" },
  { id: "higher-or-lower", icon: "swap-vertical" as const, color: "#2196F3" },
  { id: "complete-the-lineup", icon: "people" as const, color: "#9C27B0" },
  { id: "guess-by-silhouette", icon: "eye" as const, color: "#FF9800" },
  { id: "true-or-false", icon: "checkmark-circle" as const, color: "#4CAF50" },
];

const DESCRIPTION: Record<string, { en: string; ar: string }> = {
  "guess-the-player": { en: "Identify the player from the clue", ar: "خمّن اللاعب من الدليل" },
  "guess-by-history": { en: "Guess the player from club history", ar: "خمّن اللاعب من تاريخ الأندية" },
  "guess-the-nation": { en: "Match the player to their nation", ar: "طابق اللاعب مع منتخبه" },
  "higher-or-lower": { en: "Compare players' stats", ar: "قارن إحصائيات اللاعبين" },
  "complete-the-lineup": { en: "Find the missing starting XI", ar: "أكمل التشكيلة الأساسية" },
  "guess-by-silhouette": { en: "Guess the player from the shadow", ar: "خمّن اللاعب من الظل" },
  "true-or-false": { en: "Rate statements as true or false", ar: "صح أم خطأ" },
};

export default function CreateGameScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const { playerId, playerName, setIsHost } = usePlayer();
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const toggleBundle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (selected.length === 0 || creating) return;
    setCreating(true);
    try {
      setIsHost(true);
      const sessionId = await createSession(
        playerId,
        playerName || "Host",
        selected as BundleType[]
      );
      navigation.navigate("Lobby", {
        sessionId,
        bundles: selected as BundleType[],
      });
    } catch (err) {
      console.warn("Failed to create session", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <FootballBackground>
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">{t("selectBundles")}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <Text className="text-textSecondary text-sm mb-4">
            {lang === "en"
              ? "Select at least 1 bundle to start"
              : "اختر حزمة واحدة على الأقل للبدء"}
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {BUNDLES.map((bundle) => {
              const isSelected = selected.includes(bundle.id);
              return (
                <TouchableOpacity
                  key={bundle.id}
                  onPress={() => toggleBundle(bundle.id)}
                  className="w-[48.5%] rounded-2xl mb-4 overflow-hidden border"
                  style={{
                    borderColor: isSelected ? "#4CAF50" : "#A0A0B0",
                  }}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [bundle.color, "#14371B"]
                        : ["#1A1A2E", "#232340"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4 min-h-[150px]"
                  >
                    <View className="flex-row items-center justify-between">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${bundle.color}26` }}
                      >
                        <Ionicons name={bundle.icon} size={24} color={bundle.color} />
                      </View>
                      {isSelected && (
                        <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                          <Ionicons name="checkmark" size={16} color="white" />
                        </View>
                      )}
                    </View>
                    <Text className="text-text font-bold text-base mt-4">
                      {bundle.id
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Text>
                    <Text className="text-textMuted text-xs mt-1 leading-4">
                      {lang === "en"
                        ? DESCRIPTION[bundle.id]?.en
                        : DESCRIPTION[bundle.id]?.ar || ""}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Start Button */}
        <GradientButton
          onPress={handleCreate}
          loading={creating}
          disabled={selected.length === 0}
          colors={
            selected.length > 0
              ? ["#1B5E20", "#2E8B33"]
              : ["#232340", "#2A2A4A"]
          }
          label={`${t("start")} (${selected.length})`}
          labelClassName={`text-lg font-bold ${selected.length > 0 ? "text-white" : "text-textMuted"}`}
          className="mb-4"
        />
      </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
