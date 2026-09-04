import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LangProvider } from "./src/context/LangContext";
import { PlayerProvider } from "./src/context/PlayerContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <PlayerProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </PlayerProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}
