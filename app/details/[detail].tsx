import DetailCard from "@/components/DetailCard";
import { MediaItem, transformTMDBToMedia } from "@/services/formatMedia";
import { getMovieDetails } from "@/services/tmdbApi";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * DetailScreen - Displays detailed information about a selected media item
 * Fetches full movie details from TMDB API using ID from dynamic route
 */
export default function DetailScreen() {
  // useLocalSearchParams hook: Extracts ID parameter from URL (/details/123)
  const { detail } = useLocalSearchParams();

  // State for storing fetched movie details
  const [movieData, setMovieData] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect: Fetch movie details when component mounts or detail ID changes
   * Calls TMDB API with the movie ID from the URL parameter
   */
  useEffect(() => {
    if (detail) {
      loadMovieDetails();
    }
  }, [detail]);

  /**
   * loadMovieDetails - Fetches full movie details from TMDB API
   * Transforms TMDB format to our MediaItem format
   * Handles loading and error states
   */
  async function loadMovieDetails() {
    try {
      setLoading(true);
      setError(null);

      // Convert detail parameter to number (URL params come as strings)
      const movieId = parseInt(detail as string, 10);

      // Fetch full movie details including credits (cast, director)
      const tmdbMovie = await getMovieDetails(movieId);

      // Transform TMDB format to our app's format
      const transformed = transformTMDBToMedia(tmdbMovie);

      // Update state with transformed movie data
      setMovieData(transformed);
    } catch (err) {
      // Handle errors (network issues, invalid ID, API errors, etc.)
      console.error("Failed to fetch movie details:", err);
      setError("Failed to load movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Show loading spinner while fetching
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00d9ff" />
      </View>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Show "not found" message if no movie data returned
  if (!movieData) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </ScrollView>
    );
  }

  // Main detail view with movie data
  return (
    <ScrollView style={styles.container}>
      {/* Spread operator passes all properties as individual props */}
      <DetailCard {...movieData} />
    </ScrollView>
  );
}

// StyleSheet: Styling for the detail screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202040",
    padding: 16,
  },

  // New: Center content for loading/error states
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 20,
  },
});
