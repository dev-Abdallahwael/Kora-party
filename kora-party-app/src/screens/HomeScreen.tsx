import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, TextInput, Modal, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "../context/LangContext";
import { usePlayer } from "../context/PlayerContext";
import FootballBackground from "../components/FootballBackground";
import GradientButton from "../components/GradientButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const cardShadow = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.28,
  shadowRadius: 16,
  elevation: 8,
};

export default function HomeScreen({ navigation }: Props) {
  const { lang, toggleLang, t } = useLang();
  const { playerName, setPlayerName, hasSetName } = usePlayer();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const saveName = () => {
    if (nameInput.trim().length > 0) {
      setPlayerName(nameInput.trim());
      setNameModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <FootballBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-text text-3xl font-bold">{t("appName")}</Text>
            <Text className="text-textMuted text-sm mt-1">
              Football Trivia
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setNameModalVisible(true)}
              className="bg-surfaceLight rounded-full px-3 py-2 flex-row items-center mr-2"
            >
              <Ionicons name="person" size={14} color="#FFC107" />
              <Text className="text-text text-xs font-semibold ml-1">
                {hasSetName ? playerName : t("guest")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleLang}
              className="bg-surfaceLight rounded-full w-10 h-10 items-center justify-center"
            >
              <Text className="text-accent text-sm font-bold">
                {lang === "en" ? "عر" : "EN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Card */}
        <View
          className="bg-surfaceCard rounded-3xl p-6 mb-6"
          style={[cardShadow, { borderRadius: 28 }]}
        >
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
          <GradientButton
            onPress={() => navigation.navigate("CreateGame")}
            className="mb-4 rounded-md"
            style={{ width: "96%", alignSelf: "center" }}
            icon={<Ionicons name="add-circle" size={24} color="white" />}
            label={t("createGame")}
            labelClassName="text-white text-lg font-bold ml-3"
            contentClassName="py-0"
            contentStyle={{ justifyContent: "center", minHeight: 50 }}
          />

          {/* Join Game Button */}
          <GradientButton
            onPress={() => navigation.navigate("JoinGame")}
            colors={["#232340", "#2A2A4A"]}
            className="rounded-md"
            style={{ width: "96%", alignSelf: "center" }}
            icon={<Ionicons name="log-in" size={24} color="#FFC107" />}
            label={t("joinGame")}
            labelClassName="text-accent text-lg font-bold ml-3"
            contentClassName="py-0"
            contentStyle={{ justifyContent: "center", minHeight: 50 }}
          />
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          className="rounded-2xl mt-8 mb-4 overflow-hidden"
          style={[cardShadow, { backgroundColor: "#2A2208" }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3A2E0A", "#2A2208"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-7 px-4"
          >
            <View className="flex-row items-center">
              <View className="bg-accent/25 rounded-xl w-12 h-12 items-center justify-center">
                <Ionicons name="trophy" size={24} color="#FFC107" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-text font-bold" style={{ color: "#FFFFFF" }}>
                  {t("dailyChallenge")}
                </Text>
                <Text className="text-textMuted text-xs mt-1" style={{ color: "#A0A0C0" }}>
                  {lang === "en" ? "Play solo & earn streaks" : "العب وحيداً واجمع السلاسل"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFC107" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity
          className="rounded-2xl overflow-hidden"
          style={[cardShadow, { backgroundColor: "#0B1F0E" }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#12331A", "#0B1F0E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-7 px-4"
          >
            <View className="flex-row items-center">
              <View className="bg-primary/30 rounded-xl w-12 h-12 items-center justify-center">
                <Ionicons name="stats-chart" size={24} color="#4CAF50" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-text font-bold" style={{ color: "#FFFFFF" }}>
                  {t("leaderboard")}
                </Text>
                <Text className="text-textMuted text-xs mt-1" style={{ color: "#A0A0C0" }}>
                  {lang === "en" ? "See top players" : "شاهد أفضل اللاعبين"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-textMuted text-xs">
            {lang === "en"
              ? "Play with 7 bundle types • Bilingual EN/AR"
              : "7 أنواع أسئلة • ثنائية اللغة"}
          </Text>
        </View>
      </ScrollView>
      </FootballBackground>

      {/* Name Modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-background items-center justify-center px-6">
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setNameModalVisible(false)}
          />
          <View className="bg-surfaceCard rounded-3xl p-8 w-full border border-border">
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity
                onPress={() => setNameModalVisible(false)}
                className="w-8 h-8 items-center justify-center"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#8A8AB0" />
              </TouchableOpacity>
            </View>
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-4">
                <Ionicons name="person" size={32} color="#1B5E20" />
              </View>
              <Text className="text-text text-xl font-bold text-center">
                {lang === "en" ? "What's your name?" : "ما اسمك؟"}
              </Text>
              <Text className="text-textMuted text-sm text-center mt-2">
                {lang === "en"
                  ? "This is how your friends will see you."
                  : "هكذا سيراك أصدقاؤك."}
              </Text>
            </View>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder={lang === "en" ? "Enter your name" : "اكتب اسمك"}
              placeholderTextColor="#6B6B8D"
              maxLength={20}
              onSubmitEditing={saveName}
              autoFocus
              className="bg-surfaceLighter rounded-2xl py-4 px-5 text-text text-base border border-border"
            />
            <TouchableOpacity
              onPress={saveName}
              className={`rounded-2xl py-4 items-center mt-4 ${
                nameInput.trim().length > 0 ? "bg-primary" : "bg-surfaceLighter"
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-lg font-bold ${nameInput.trim().length > 0 ? "text-white" : "text-textMuted"}`}>
                {lang === "en" ? "Continue" : "متابعة"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
