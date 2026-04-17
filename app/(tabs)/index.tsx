import { colors, fonts } from "@/constants/theme";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

/**
 * Home Screen (Index) - The landing page of the application
 * Displays welcome content and provides navigation to other screens
 * Uses React Native components for cross-platform mobile UI
 */
export default function Index() {
  return (
    // View: React Native container component (equivalent to div in web)
    // Flexbox layout container that centers content both vertically and horizontally
    <View style={styles.container}>
      {/* Text: React Native component for displaying text content */}
      <Text style={styles.text}>Home screen</Text>

      {/* Link: Navigation component from expo-router for declarative navigation */}
      {/* Creates a pressable link that navigates to /about when pressed */}
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
    </View>
  );
}

// StyleSheet: Optimized way to define styles in React Native
// Creates optimized style objects that are compiled to native platform styles
const styles = StyleSheet.create({
  // container: Main view container styles
  container: {
    flex: 1, // Takes up all available space (full screen height)
    backgroundColor: colors.bgColor, // Dark background (#202040)
    alignItems: "center", // Horizontally center children
    justifyContent: "center", // Vertically center children
  },

  // text: Typography styling for the heading text
  text: {
    fontFamily: fonts.regular, // Uses K2D-Regular font from theme constants
    color: colors.txtColor, // Light text color (#F0F0F0) for readability on dark background
  },

  // button: Styling for the navigation link
  button: {
    fontSize: 20, // Larger text size for prominent link
    textDecorationLine: "underline", // Underline to indicate it's clickable
    color: colors.txtColor, // Light text color (#F0F0F0)
  },
});
