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
    ></Stack>
  );
}
