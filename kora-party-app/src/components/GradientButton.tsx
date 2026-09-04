import React from "react";
import { Text, TouchableOpacity, ActivityIndicator, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  colors?: readonly [string, string, ...string[]];
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  labelClassName?: string;
};

const DEFAULT_COLORS: readonly [string, string, ...string[]] = [
  "#1B5E20",
  "#2E8B33",
];

export default function GradientButton({
  children,
  label,
  onPress,
  colors = DEFAULT_COLORS,
  disabled = false,
  loading = false,
  icon,
  className = "",
  style,
  labelClassName = "text-white text-lg font-bold",
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`rounded-2xl overflow-hidden ${isDisabled ? "opacity-50" : ""} ${className}`}
      style={style}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-4 px-6 items-center justify-center flex-row"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {icon}
            {label ? (
              <Text className={labelClassName}>{label}</Text>
            ) : (
              children
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
