import { colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

/**
 * About Screen - Displays application information
 * Simple screen component providing app details and metadata
 * Can be extended with more content, links, or version information
 */
export default function AboutScreen() {
  return (
    // View: Root container for the About screen
    // Uses flex layout with centered content
    <View style={styles.container}>
      {/* Text: Simple text content displayed in the center of the screen */}
      <Text style={styles.text}>About screen</Text>
    </View>
  );
}

// StyleSheet: Defines all styling for the About screen components
const styles = StyleSheet.create({
  // container: Main view styles for centered layout
  container: {
    flex: 1, // Fills entire available space on screen
    backgroundColor: colors.bgColor, // Dark background (#202040) from theme
    justifyContent: "center", // Vertically center children in flex column
    alignItems: "center", // Horizontally center children
  },

  // text: Styling for the about screen text content
  text: {
    color: colors.txtColor, // Light text color (#F0F0F0) for contrast
  },
});
