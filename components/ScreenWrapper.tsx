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

  useFocusEffect(
    useCallback(() => {
      const easeOut = { duration: 500, easing: Easing.out(Easing.ease) };

      opacity.value = withTiming(1, easeOut);
      translateY.value = withTiming(0, easeOut);

      return () => {
        opacity.value = withTiming(0, {
          duration: 700,
          easing: Easing.in(Easing.ease),
        });
        translateY.value = 6;
      };
    }, [opacity, translateY]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
