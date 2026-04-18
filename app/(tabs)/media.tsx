import MediaCard from "@/components/MediaCard";
import { colors } from "@/constants/theme";
import { MediaItem, transformTMDBToMedia } from "@/services/formatMedia";
import { getPopularMovies } from "@/services/tmdbApi";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

/**
 * Media Screen - Displays a grid of media items (movies)
 * Fetches movies from TMDB API and shows them in a 2-column grid layout
 */
export default function MediaScreen() {
  const router = useRouter();

  // State for storing fetched movies
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect: Fetch media data when component mounts
   * Calls TMDB API to get popular movies and transforms them to our format
   */
  useEffect(() => {
    loadMediaData();
  }, []);

  /**
   * loadMediaData - Fetches movies from TMDB API
   * Transforms TMDB format to our MediaItem format
   * Handles loading and error states
   */
  async function loadMediaData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch popular movies from TMDB (page 1)
      const data = await getPopularMovies(1);

      // Transform TMDB format to our app's format
      const transformed = data.results.map(transformTMDBToMedia);

      // Update state with transformed movies
      setMediaArray(transformed);
    } catch (err) {
      // Handle errors (network issues, API errors, etc.)
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * handleMediaPress - Navigate to detail screen when card is pressed
   * @param id {string} - The unique identifier of the selected media item
   */
  const handleMediaPress = (id: string) => {
    router.push(`/details/${id}`);
  };

  // Show loading spinner while fetching
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.accent1} />
      </View>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        {/* You could also show a retry button here */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mediaArray}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleMediaPress(item.id)}
            style={styles.cardWrapper}
          >
            <MediaCard
              id={item.id}
              title={item.title}
              poster={item.poster}
              rating={item.rating}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

// StyleSheet: Added centerContent for loading/error states
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },

  // New: Center content for loading/error states
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    padding: 16,
  },

  row: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%",
  },
});
