import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import { joinSession } from "../utils/sessionService";
import FootballBackground from "../components/FootballBackground";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "JoinGame">;
};

const cardShadow = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.28,
  shadowRadius: 16,
  elevation: 8,
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
          <View
            className="bg-surfaceCard rounded-xl p-8 w-full"
            style={[cardShadow, { borderRadius: 20, transform: [{ translateY: -40 }] }]}
          >
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

            <TouchableOpacity
              onPress={handleJoin}
              disabled={joining || code.length < 4}
              activeOpacity={0.85}
              className="self-center rounded-2xl overflow-hidden mt-6"
              style={{
                height: 68,
                paddingHorizontal: 28,
                opacity: code.length < 4 ? 0.4 : 1,
                elevation: 0,
                backgroundColor: "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {joining ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-xl font-extrabold tracking-wide">
                  {t("join")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </FootballBackground>
    </SafeAreaView>
  );
}
