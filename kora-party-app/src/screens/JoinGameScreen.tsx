import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import { joinSession } from "../utils/sessionService";
import FootballBackground from "../components/FootballBackground";
import GradientButton from "../components/GradientButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "JoinGame">;
};

export default function JoinGameScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const { playerId, playerName, setIsHost } = usePlayer();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (code.length < 4 || joining) return;
    setJoining(true);
    setError(null);
    try {
      setIsHost(false);
      const ok = await joinSession(code.toUpperCase(), playerId, playerName || "Guest");
      if (!ok) {
        setError(lang === "en" ? "Session not found" : "لم يتم العثور على المباراة");
        setJoining(false);
        return;
      }
      navigation.navigate("Lobby", { sessionId: code.toUpperCase() });
    } catch (err) {
      console.warn("Failed to join session", err);
      setError(lang === "en" ? "Failed to join. Check your connection." : "فشل الانضمام. تحقق من اتصالك.");
      setJoining(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <FootballBackground>
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">{t("joinGame")}</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="bg-surfaceCard rounded-3xl p-8 w-full border border-border">
            <View className="items-center mb-6">
              <View className="bg-accent/20 rounded-full w-20 h-20 items-center justify-center mb-4">
                <Ionicons name="key" size={36} color="#FFC107" />
              </View>
              <Text className="text-text text-xl font-bold text-center">
                {t("enterSessionCode")}
              </Text>
            </View>

            <TextInput
              value={code}
              onChangeText={(v) => {
                setCode(v.toUpperCase());
                setError(null);
              }}
              placeholder="XXXXXX"
              placeholderTextColor="#6B6B8D"
              maxLength={6}
              className="bg-surfaceLighter rounded-2xl py-4 px-6 text-center text-2xl font-bold text-text tracking-widest border border-border"
              autoCapitalize="characters"
            />

            {error && (
              <Text className="text-danger text-center mt-3 text-sm">{error}</Text>
            )}

            <GradientButton
              onPress={handleJoin}
              loading={joining}
              disabled={code.length < 4}
              colors={
                code.length >= 4
                  ? ["#1B5E20", "#2E8B33"]
                  : ["#232340", "#2A2A4A"]
              }
              label={t("join")}
              labelClassName={`text-lg font-bold ${code.length >= 4 ? "text-white" : "text-textMuted"}`}
              className="mt-6"
            />
          </View>
        </View>
      </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
