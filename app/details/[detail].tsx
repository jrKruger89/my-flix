import DetailCard from "@/components/DetailCard";
import { mockMediaEntries } from "@/data/mockMedia";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

/**
 * DetailScreen - Displays detailed information about a selected media item
 * Receives ID parameter from dynamic route (/details/[id])
 * Extracts corresponding movie data and displays it in an expanded view
 */
export default function DetailScreen() {
  // useLocalSearchParams hook: Extracts parameters from the current URL
  // Returns object with named parameters from the dynamic route
  // Example: URL /details/1 returns { detail: "1" }
  const { detail } = useLocalSearchParams();

  // Find the movie data matching the ID parameter
  // Object.values converts the mock data object to array
  // find() method returns the first item where movie.id === detail (the URL parameter)
  // Result: Movie object or undefined if not found
  const mockData = Object.values(mockMediaEntries).find(
    (movie) => movie.id === detail,
  );

  // Fallback rendering if the requested movie ID doesn't exist
  // Shows error message and prevents app crash from undefined data
  if (!mockData) {
    return (
      // ScrollView: Allows vertical scrolling if content exceeds screen height
      <ScrollView style={styles.container}>
        {/* Error message text - displayed in red for visibility */}
        <Text style={styles.errorText}>Movie not found</Text>
      </ScrollView>
    );
  }

  // Main detail view with scrollable content
  return (
    // ScrollView: Container that enables scrolling on content that exceeds screen size
    // Useful for detail views with variable amounts of content (cast, description, etc.)
    <ScrollView style={styles.container}>
      {/* 
        DetailCard: Reusable component displaying full movie details
        Spread operator (...mockData) passes all properties as individual props
        Includes: id, title, poster, rating, releaseYear, cast, director, description, playTime
      */}
      <DetailCard {...mockData} />
    </ScrollView>
  );
}

// StyleSheet: Styling for the detail screen layout
const styles = StyleSheet.create({
  // container: Main scrollable container styles
  container: {
    flex: 1, // Fill entire available space
    backgroundColor: "#202040", // Dark background matching app theme
    padding: 16, // 16 units of padding on all sides
  },

  // errorText: Styling for error message when movie not found
  errorText: {
    fontSize: 16, // Readable text size
    color: "#ff6b6b", // Red color indicating error
    textAlign: "center", // Center error message on screen
    marginTop: 20, // Space from top of view
  },
});
