import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "JoinGame">;
};

export default function JoinGameScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const [code, setCode] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-background">
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
              onChangeText={setCode}
              placeholder="XXXXXX"
              placeholderTextColor="#6B6B8D"
              maxLength={6}
              className="bg-surfaceLighter rounded-2xl py-4 px-6 text-center text-2xl font-bold text-text tracking-widest border border-border"
              autoCapitalize="characters"
            />

            <TouchableOpacity
              onPress={() => {
                if (code.length >= 4) {
                  navigation.navigate("Lobby", { sessionId: code });
                }
              }}
              className={`rounded-2xl py-4 items-center mt-6 ${
                code.length >= 4 ? "bg-primary" : "bg-surfaceLighter"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-lg font-bold ${
                  code.length >= 4 ? "text-white" : "text-textMuted"
                }`}
              >
                {t("join")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
