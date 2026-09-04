import React, { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";

type Props = TouchableOpacityProps & {
  scaleTo?: number;
  children: React.ReactNode;
};

export default function PressableScale({
  scaleTo = 0.95,
  activeOpacity = 0.9,
  children,
  style,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        {...rest}
        activeOpacity={activeOpacity}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
