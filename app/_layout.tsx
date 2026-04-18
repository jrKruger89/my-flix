import {
  K2D_400Regular,
  K2D_600SemiBold,
  K2D_700Bold,
  useFonts,
} from "@expo-google-fonts/k2d";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from automatically hiding while fonts load
// This ensures a smooth UX while custom fonts are being fetched
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout - The root navigation component for the entire application
 * Manages font loading and establishes the top-level navigation structure
 * Uses Stack navigation from expo-router to define the app's navigation hierarchy
 */
export default function RootLayout() {
  // useFonts hook: Loads custom fonts asynchronously from @expo-google-fonts
  // Returns [fontsLoaded, fontError] tuple:
  //   - fontsLoaded: boolean indicating if fonts have finished loading
  //   - fontError: error object if font loading failed, null otherwise
  const [fontsLoaded, fontError] = useFonts({
    "K2D-Regular": K2D_400Regular, // Regular weight font for body text
    "K2D-SemiBold": K2D_600SemiBold, // Semi-bold weight for emphasis
    "K2D-Bold": K2D_700Bold, // Bold weight for headings
  });

  // useEffect: Side effect hook to hide splash screen once fonts are loaded
  // Runs whenever fontsLoaded or fontError changes (dependency array)
  useEffect(() => {
    // Hide the splash screen if fonts have finished loading or an error occurred
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show null while fonts are still loading - prevents rendering with wrong fonts
  // Returns nothing, which keeps the splash screen visible until fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Stack: Navigation container from expo-router that manages screen transitions
  // Creates a navigation stack where screens can be pushed/popped
  return (
    <Stack>
      {/* Stack.Screen: Defines the (tabs) group as the initial/root route */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }} // Hide default header - managed by Tab navigator
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Stack>
  );
}
