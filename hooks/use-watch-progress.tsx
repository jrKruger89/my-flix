import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "./use-auth-context";

export interface WatchProgress {
  mediaId: number;
  mediaType: "movie" | "tv";
  minutesWatched: number;
  totalRuntime: number;
  lastUpdated: string;
}

const STORAGE_KEY = "watch_progress";

export function useWatchProgress(
  mediaId: number,
  mediaType: "movie" | "tv",
  refreshTrigger?: number,
) {
  const { profile } = useAuthContext();
  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const progressMap = stored ? JSON.parse(stored) : {};
      const key = `${mediaId}_${mediaType}`;

      if (progressMap[key]) {
        setProgress(progressMap[key]);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mediaId, mediaType]);

  // Load progress from local storage on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress, refreshTrigger]);

  const updateProgress = useCallback(
    async (minutesWatched: number, totalRuntime: number) => {
      try {
        const newProgress: WatchProgress = {
          mediaId,
          mediaType,
          minutesWatched: Math.max(0, Math.min(minutesWatched, totalRuntime)),
          totalRuntime,
          lastUpdated: new Date().toISOString(),
        };

        // Save locally
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const progressMap = stored ? JSON.parse(stored) : {};
        const key = `${mediaId}_${mediaType}`;
        progressMap[key] = newProgress;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));

        setProgress(newProgress);

        // Sync to Supabase if user is logged in
        if (profile?.id) {
          await supabase.from("watch_progress").upsert({
            user_id: profile.id,
            media_id: mediaId,
            media_type: mediaType,
            minutes_watched: newProgress.minutesWatched,
            total_runtime: totalRuntime,
          });
        }
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    },
    [mediaId, mediaType, profile],
  );

  const clearProgress = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const progressMap = stored ? JSON.parse(stored) : {};
      const key = `${mediaId}_${mediaType}`;
      delete progressMap[key];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      setProgress(null);

      if (profile?.id) {
        await supabase
          .from("watch_progress")
          .delete()
          .eq("user_id", profile.id)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType);
      }
    } catch (error) {
      console.error("Failed to clear progress:", error);
    }
  }, [mediaId, mediaType, profile]);

  return { progress, isLoading, updateProgress, clearProgress };
}
