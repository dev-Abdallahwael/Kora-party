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

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

function shade(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  return toHex(
    r + (t - r) * p,
    g + (t - g) * p,
    b + (t - b) * p
  );
}

function mixWithWhite(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const p = percent / 100;
  return toHex(
    r + (255 - r) * p,
    g + (255 - g) * p,
    b + (255 - b) * p
  );
}

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
                  className="w-[49%] rounded-2xl mb-4 overflow-hidden"
                  style={{
                    transform: [{ scale: isSelected ? 0.98 : 1 }],
                    opacity: isSelected ? 1 : 0.9,
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 4,
                  }}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [bundle.color, shade(bundle.color, -30)]
                        : [mixWithWhite(bundle.color, 25), shade(bundle.color, -18)]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.9, y: 1 }}
                    className="p-5 min-h-[180px] items-center justify-center"
                  >
                    {isSelected && (
                      <View className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white items-center justify-center">
                        <Ionicons name="checkmark" size={16} color={bundle.color} />
                      </View>
                    )}
                    <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center mb-3 self-center">
                      <Ionicons name={bundle.icon} size={30} color="#FFFFFF" />
                    </View>
                    <Text className="text-white font-extrabold text-base text-center">
                      {bundle.id
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Text>
                    <Text className="text-white/80 text-xs mt-1.5 leading-4 text-center">
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
        <View className="items-center justify-end pb-6">
          <TouchableOpacity
            onPress={handleCreate}
            disabled={creating || selected.length === 0}
            activeOpacity={0.85}
            className="self-center rounded-2xl overflow-hidden"
            style={{
              height: 68,
              paddingHorizontal: 40,
              opacity: selected.length === 0 ? 0.4 : 1,
              elevation: 0,
              backgroundColor: "#4CAF50",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {creating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-xl font-extrabold tracking-wide">
                {t("start")} ({selected.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
