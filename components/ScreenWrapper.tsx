import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function ScreenWrapper({ children }) {
  const opacity = useSharedValue(0.5);
  const translateY = useSharedValue(6);

  const easeOut = { duration: 300, easing: Easing.out(Easing.ease) };

  useFocusEffect(
    useCallback(() => {
      opacity.value = withTiming(1, easeOut);
      translateY.value = withTiming(0, easeOut);

      return () => {
        opacity.value = withTiming(0, {
          duration: 200,
          easing: Easing.in(Easing.ease),
        });
        translateY.value = 6;
      };
    }, []),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
