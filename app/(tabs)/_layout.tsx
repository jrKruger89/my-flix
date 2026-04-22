import { colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// ==== Tabs Animation====
const tabIcons = [
  { name: "index", icon: "home-outline", activeIcon: "home-sharp" },
  { name: "media", icon: "film-outline", activeIcon: "film" },
  {
    name: "profile",
    icon: "person-circle-outline",
    activeIcon: "person-circle",
  },
];

const tabBarWidth = Dimensions.get("window").width - 40 - 6;
const tabWidth = tabBarWidth / tabIcons.length;
const bubbleWidth = 45;
const bubblePosition = (index: number) =>
  tabWidth * index + tabWidth / 2 - bubbleWidth / 2;

function AnimatedTabBarIcon({ state, navigation }) {
  const bubbleX = useSharedValue(bubblePosition(state.index));

  useEffect(() => {
    bubbleX.value = withSpring(bubblePosition(state.index), {
      damping: 90,
      stiffness: 700,
    });
  }, [bubbleX, state.index]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
  }));

  return (
    <View style={styles.tabBar}>
      <Animated.View style={[styles.bubble, bubbleStyle]} />
      {tabIcons.map((tab, index) => {
        const focused = state.index === index;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={focused ? tab.activeIcon : tab.icon}
              color={colors.txtColor}
              size={24}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * TabLayout - Navigation layout component that creates a tabbed interface
 * Manages three main screens: Home, Media, and About
 * Uses expo-router's Tabs component for bottom tab navigation
 */
export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <AnimatedTabBarIcon {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "My Flix", headerShown: false }}
      />
      <Tabs.Screen
        name="media"
        options={{ title: "Media", headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
}

const styles = {
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.accent2,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.accent1,
    height: 65,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  bubble: {
    backgroundColor: colors.accent1,
    borderRadius: 30,
    width: bubbleWidth,
    height: bubbleWidth,
    position: "absolute",
  },
};
