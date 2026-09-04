import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FootballBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 overflow-hidden bg-background">
      <LinearGradient
        colors={["#061810", "#0A2819", "#071B25"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["rgba(25, 111, 58, 0.38)", "rgba(25, 111, 58, 0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: -160, left: -120, width: 430, height: 430, borderRadius: 215 }}
        pointerEvents="none"
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -230,
          left: -170,
          width: 500,
          height: 500,
          borderRadius: 250,
          backgroundColor: "#0D5B35",
          opacity: 0.2,
        }}
      />

      <View className="flex-1">{children}</View>
    </View>
  );
}
