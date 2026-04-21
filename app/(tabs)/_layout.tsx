import { colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";

/**
 * TabLayout - Navigation layout component that creates a tabbed interface
 * Manages three main screens: Home, Media, and About
 * Uses expo-router's Tabs component for bottom tab navigation
 */
export default function TabLayout() {
  return (
    // Tabs: Native tab bar navigator from expo-router
    // Displays multiple screens accessible via a bottom tab bar
    // Automatically handles switching between screens and persists state
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Color of focused tab icon and label
        // Using gold (#ffd33d) to highlight the active tab
        tabBarActiveTintColor: "#fff",

        // headerStyle: Customizes the header bar appearance at the top of each screen
        // Set dark background (#25292e) to match app theme
        headerStyle: {
          backgroundColor: "#1B183D",
        },

        // headerShadowVisible: Removes default shadow under header for cleaner look
        headerShadowVisible: false,

        // headerTintColor: Color of header text and back button
        // Using white (#fff) for contrast against dark background
        headerTintColor: "#fff",

        // tabBarStyle: Customizes the entire tab bar appearance
        // Matches header background for consistent dark theme
        tabBarStyle: {
          backgroundColor: colors.accent2,
          margin: 20,
          marginBottom: 30,
          borderRadius: 40,
          position: "absolute",
          elevation: 0,
          shadowOpacity: 0,
          borderWidth: 3, // Sets the border thickness for all sides
          borderColor: colors.accent1, // Sets the border color to accent1 for all sides
          borderTopWidth: 3,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#fff", // Sets the inactive tab icon color to white
      }}
    >
      {/* First Tab Screen: Home */}
      <Tabs.Screen
        name="index" // Route name corresponds to index.tsx file
        options={{
          title: "My Flix",
          tabBarIcon: ({ color, focused }) => (
            // Ionicons: Icon library from @expo/vector-icons
            // Provides Material Design and Ionicons icons as React components
            <View
              style={[
                styles.iconWrapper,
                focused && styles.activeIconWrapper, // Add circle background if focused
              ]}
            >
              <Ionicons
                // Conditional icon: Shows filled icon when active, outline when inactive
                // home-sharp (filled) vs home-outline (unfilled)
                name={focused ? "home-sharp" : "home-outline"}
                // color: Automatically set to active/inactive color based on focus state
                color={color}
                // size: Icon size in logical pixels
                size={24}
              />
            </View>
          ),
        }}
      />

      {/* Second Tab Screen: Media */}
      <Tabs.Screen
        name="media" // Route name corresponds to media.tsx file
        options={{
          title: "Media", // Text displayed under the tab icon

          // tabBarIcon: Renders film icon that changes based on focus state
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.activeIconWrapper, // Add circle background if focused
              ]}
            >
              <Ionicons
                // film (filled) for active, film-outline (unfilled) for inactive
                name={focused ? "film" : "film-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.activeIconWrapper, // Add circle background if focused
              ]}
            >
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: 10 }],
  },
  activeIconWrapper: {
    backgroundColor: colors.accent1,
    borderRadius: 30, // Ensure it's a perfect circle
    width: 45,
    height: 45,
    transform: [{ translateY: 10 }], // Moves the circle slightly more downward
  },
};
