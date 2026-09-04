import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import * as Clipboard from "expo-clipboard";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Lobby">;
  route: RouteProp<RootStackParamList, "Lobby">;
};

const MOCK_PLAYERS = [
  { id: "1", name: "Ahmed", isHost: true, score: 0 },
  { id: "2", name: "Sara", isHost: false, score: 0 },
  { id: "3", name: "Omar", isHost: false, score: 0 },
];

export default function LobbyScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { sessionId } = route.params;
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await Clipboard.setStringAsync(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold">{t("waitingForPlayers")}</Text>
          <View className="w-6" />
        </View>

        {/* Session Code Card */}
        <View className="bg-surfaceCard rounded-3xl p-6 items-center mb-6 border border-border">
          <Text className="text-textMuted text-sm mb-2">{lang === "en" ? "Share this code" : "شارك هذا الرمز"}</Text>
          <Text className="text-accent text-4xl font-bold tracking-widest mb-4">
            {sessionId}
          </Text>
          <TouchableOpacity
            onPress={copyCode}
            className="bg-surfaceLighter rounded-xl py-2 px-6 flex-row items-center border border-border"
          >
            <Ionicons
              name={copied ? "checkmark" : "copy"}
              size={18}
              color={copied ? "#4CAF50" : "#FFC107"}
            />
            <Text className="text-textSecondary text-sm ml-2">
              {copied ? (lang === "en" ? "Copied!" : "تم النسخ!") : t("shareCode")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Players List */}
        <Text className="text-text font-bold mb-3">
          {t("players")} ({players.length})
        </Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-surfaceCard rounded-2xl p-4 mb-2 flex-row items-center border border-border">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-primary font-bold text-sm">
                  {item.name.charAt(0)}
                </Text>
              </View>
              <Text className="text-text font-semibold ml-3 flex-1">{item.name}</Text>
              {item.isHost && (
                <View className="bg-accent/20 rounded-full px-3 py-1">
                  <Text className="text-accent text-xs font-bold">{t("host")}</Text>
                </View>
              )}
            </View>
          )}
        />

        {/* Start Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Game", { sessionId })}
          className="bg-primary rounded-2xl py-4 items-center mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">{t("start")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
