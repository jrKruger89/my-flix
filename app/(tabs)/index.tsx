import { ScreenWrapper } from "@/components/ScreenWrapper";
import MediaRow from "@/components/mediaRow";
import { bottom_padding } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useMediaData } from "@/hooks/use-media-data";
import { supabase } from "@/lib/supabase";
import { MediaItem, transformTMDBToMedia } from "@/services/formatMedia";
import { getTrendingMovies } from "@/services/tmdbApi";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

/**
 * Home Screen (Index) - The landing page of the application
 * Displays welcome content and provides navigation to other screens
 * Uses React Native components for cross-platform mobile UI
 */
type FavoriteItem = {
  id: number;
  media_id: number;
  media_type: "movie" | "tv";
  title: string | null;
  poster_path: string | null;
  created_at: string;
};

export default function Index() {
  const { mediaArray, handleMediaPress } = useMediaData();
  const { claims } = useAuthContext();
  const userId = claims?.sub;
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function loadTrending() {
      const data = await getTrendingMovies(1);
      setTrending(data.results.map(transformTMDBToMedia));
    }
    loadTrending();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function loadFavorites() {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, media_id, media_type, title, poster_path, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setFavorites((data ?? []) as FavoriteItem[]);
    }

    loadFavorites();
    const subscription = supabase
      .channel("favorites-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorites",
          filter: `user_id=eq.${userId}`,
        },
        () => loadFavorites(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScreenWrapper>
        <ScrollView contentContainerStyle={{ paddingBottom: bottom_padding }}>
          <View style={styles.container}>
            <MediaRow
              title="Currently Watching"
              emptyMessage="You're not currently watching any movies or series yet!"
              mediaArray={mediaArray}
              handleMediaPress={handleMediaPress}
            />
            <MediaRow
              title="Watchlist"
              emptyMessage="You haven't added any movies or series yet!"
              mediaArray={favorites.map((item) => ({
                ...item,
                id: item.media_id,
                poster: item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : null,
              }))}
              handleMediaPress={handleMediaPress}
            />
            <MediaRow
              title="Trending This Week"
              mediaArray={trending}
              handleMediaPress={handleMediaPress}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </LinearGradient>
  );
}

// StyleSheet: Optimized way to define styles in React Native
// Creates optimized style objects that are compiled to native platform styles
const styles = StyleSheet.create({
  // container: Main view container styles
  container: {
    flex: 1,
    padding: 5,
  },
});
