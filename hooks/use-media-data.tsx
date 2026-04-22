import { MediaItem, transformTMDBToMedia } from "@/services/formatMedia";
import { getPopularMovies } from "@/services/tmdbApi";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useMediaData() {
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadMediaData();
  }, []);

  // Refetch when screen comes into focus to update favorite states
  useFocusEffect(
    useCallback(() => {
      // Force re-render of all FavoriteButtons by triggering a query
      // This ensures favorites are up-to-date when returning to this screen
      loadMediaData();
    }, []),
  );

  async function loadMediaData() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPopularMovies(1);
      const transformed = data.results.map(transformTMDBToMedia);
      setMediaArray(transformed);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleMediaPress = (id: string) => {
    router.push(`/media/${id}?type=movie`);
  };

  return { mediaArray, loading, error, handleMediaPress };
}
