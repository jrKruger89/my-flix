import { Stack } from "expo-router";

/**
 * DetailsLayout - Navigation layout for the details section
 * Manages the detail view routes using Stack navigation
 * Handles dynamic routing with URL parameters (e.g., /details/[id])
 */
export default function DetailsLayout() {
  return (
    // Stack: Navigation container that implements native stack transitions
    // Provides push/pop navigation with back button and card-based animations
    <Stack
      screenOptions={{
        // headerShown: Controls visibility of the native navigation header
        // Set to false to hide the default header (custom header managed in detail screen)
        headerShown: false,

        // headerBackButtonDisplayMode: Would customize the back button appearance
        // "minimal" shows just arrow icon without text label
        // Currently commented out - using default back button behavior
        // headerBackButtonDisplayMode: "minimal",
      }}
    >
      {/* 
        Stack.Screen: Defines a route in the navigation stack
        name="[detail]": Dynamic route parameter - matches [detail].tsx filename
        The brackets indicate a dynamic segment that captures URL parameters
        Example URLs: /details/1, /details/2 extract id "1" or "2"
      */}
      <Stack.Screen
        name="[detail]"
        options={{
          title: "Details", // Header title shown at top of detail screen
        }}
      />
    </Stack>
  );
}
