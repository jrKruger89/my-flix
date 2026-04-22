import MediaCard from "@/components/MediaCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import { MediaItem, transformTMDBToMedia } from "@/services/formatMedia";
import { getPopularMovies, getPopularTV } from "@/services/tmdbApi";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function MediaScreen() {
  const router = useRouter();

  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShowingTV, setIsShowingTV] = useState(false); // New state

  useEffect(() => {
    loadMediaData();
  }, [isShowingTV]); // Re-fetch when toggle changes

  async function loadMediaData() {
    try {
      setLoading(true);
      setError(null);

      const data = isShowingTV
        ? await getPopularTV(1)
        : await getPopularMovies(1);
      const transformed = data.results.map(transformTMDBToMedia);
      setMediaArray(transformed);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      setError("Failed to load media. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleMediaPress = (id: string) => {
    router.push(`/details/${id}?type=${isShowingTV ? "tv" : "movie"}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.accent1} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        {/* Error handling */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenWrapper>
        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Movies</Text>
          <Switch
            value={isShowingTV}
            onValueChange={setIsShowingTV}
            trackColor={{ false: colors.accent1, true: colors.accent1 }}
            thumbColor={colors.accent2}
          />
          <Text style={styles.toggleLabel}>TV Shows</Text>
        </View>

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
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  toggleLabel: {
    color: colors.txtColor,
    fontSize: 14,
    fontWeight: "600",
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
