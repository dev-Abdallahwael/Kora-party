import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CreateGameScreen from "../screens/CreateGameScreen";
import JoinGameScreen from "../screens/JoinGameScreen";
import LobbyScreen from "../screens/LobbyScreen";
import GameScreen from "../screens/GameScreen";
import ResultScreen from "../screens/ResultScreen";
import DailyChallengeScreen from "../screens/DailyChallengeScreen";
import { BundleType } from "../types";

export type RootStackParamList = {
  Home: undefined;
  CreateGame: undefined;
  JoinGame: undefined;
  Lobby: { sessionId: string; bundles?: BundleType[] };
  Game: { sessionId: string; bundles: BundleType[] };
  Result: { sessionId: string; bundles?: BundleType[] };
  DailyChallenge: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateGame" component={CreateGameScreen} />
        <Stack.Screen name="JoinGame" component={JoinGameScreen} />
        <Stack.Screen name="Lobby" component={LobbyScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
