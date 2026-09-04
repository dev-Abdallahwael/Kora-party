import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import { listenToSession, startGame, setupDisconnectHandler, checkAndTransferHost } from "../utils/sessionService";
import { FirebaseSession } from "../utils/sessionService";
import * as Clipboard from "expo-clipboard";
import FootballBackground from "../components/FootballBackground";
import GradientButton from "../components/GradientButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Lobby">;
  route: RouteProp<RootStackParamList, "Lobby">;
};

export default function LobbyScreen({ navigation, route }: Props) {
  const { lang, t } = useLang();
  const { playerId, playerName, isHost, setIsHost } = usePlayer();
  const { sessionId, bundles } = route.params;
  const [session, setSession] = useState<FirebaseSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setupDisconnectHandler(sessionId, playerId);
    const unsubscribe = listenToSession(sessionId, (s) => {
      setSession(s);
      if (s) {
        setIsHost(s.hostId === playerId);
        checkAndTransferHost(sessionId);
      }
    });
    return unsubscribe;
  }, [sessionId, playerId]);

  const copyCode = async () => {
    await Clipboard.setStringAsync(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const players = session
    ? Object.values(session.players || {})
    : [];

  const handleStart = async () => {
    if (!isHost || starting) return;
    setStarting(true);
    try {
      const seed = session?.seed ?? Math.floor(Math.random() * 1_000_000);
      await startGame(sessionId, seed);
      navigation.navigate("Game", {
        sessionId,
        bundles: (bundles as any) || ["guess-the-player", "true-or-false"],
      });
    } catch (err) {
      console.warn("Failed to start game", err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <FootballBackground>
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
          {!isHost && players.length > 0 && (
            <Text className="text-textMuted text-xs mt-3">
              {lang === "en"
                ? `Host is ${Object.values(session!.players).find((p) => p.isHost)?.name || ""}`
                : `المضيف هو ${Object.values(session!.players).find((p) => p.isHost)?.name || ""}`}
            </Text>
          )}
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
                  {item.name?.charAt(0) || "?"}
                </Text>
              </View>
              <Text className="text-text font-semibold ml-3 flex-1">
                {item.name}
                {item.id === playerId ? " (you)" : ""}
              </Text>
              {item.isHost && (
                <View className="bg-accent/20 rounded-full px-3 py-1">
                  <Text className="text-accent text-xs font-bold">{t("host")}</Text>
                </View>
              )}
            </View>
          )}
        />

        {/* Start Button - only host */}
        {isHost ? (
          <GradientButton
            onPress={handleStart}
            loading={starting}
            label={t("start")}
            className="mb-4"
          />
        ) : (
          <View className="mb-4 items-center py-4">
            <Text className="text-textMuted">{lang === "en" ? "Waiting for host to start..." : "في انتظار بدء المضيف..."}</Text>
          </View>
        )}
      </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
