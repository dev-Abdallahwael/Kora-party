import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
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

export default function CreateGameScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleBundle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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

          {BUNDLES.map((bundle) => {
            const isSelected = selected.includes(bundle.id);
            return (
              <TouchableOpacity
                key={bundle.id}
                onPress={() => toggleBundle(bundle.id)}
                className={`rounded-2xl p-4 mb-3 border ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-surfaceCard border-border"
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${bundle.color}20` }}
                  >
                    <Ionicons name={bundle.icon} size={24} color={bundle.color} />
                  </View>
                  <Text className="text-text font-semibold ml-4 flex-1 text-base">
                    {bundle.id
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#1B5E20" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Start Button */}
        <TouchableOpacity
          onPress={() => {
            if (selected.length > 0) {
              navigation.navigate("Lobby", { sessionId: "TEMP_ID" });
            }
          }}
          className={`rounded-2xl py-4 items-center mb-4 ${
            selected.length > 0 ? "bg-primary" : "bg-surfaceLighter"
          }`}
          activeOpacity={0.8}
        >
          <Text
            className={`text-lg font-bold ${
              selected.length > 0 ? "text-white" : "text-textMuted"
            }`}
          >
            {t("start")} ({selected.length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
