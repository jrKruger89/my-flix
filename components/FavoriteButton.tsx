// components/FavoriteButton.tsx
import { colors } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import Heart from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";

interface FavoriteButtonProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
}

export default function FavoriteButton({
  mediaId,
  mediaType,
  title,
  posterPath,
}: FavoriteButtonProps) {
  const { claims } = useAuthContext();
  const userId = claims?.sub;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial favorite status
  useEffect(() => {
    if (!userId) return;

    async function checkInitialFavorite() {
      try {
        const { data } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", userId)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType)
          .single();

        setIsFavorite(!!data);
      } catch (err) {
        setIsFavorite(false);
      }
    }

    checkInitialFavorite();
  }, [userId, mediaId, mediaType]);

  async function toggleFavorite() {
    if (!userId || isLoading) return;

    // Optimistic update - store previous state and update UI immediately
    const previousFavoriteState = isFavorite;
    setIsFavorite(!isFavorite);
    setIsLoading(true);

    try {
      if (previousFavoriteState) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType);

        if (error) {
          console.error("Error removing favorite:", error);
          // Revert on error
          setIsFavorite(previousFavoriteState);
          return;
        }
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: userId,
          media_id: mediaId,
          media_type: mediaType,
          title,
          poster_path: posterPath,
        });

        if (error) {
          console.error("Error adding favorite:", error);
          // Revert on error
          setIsFavorite(previousFavoriteState);
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Pressable
      onPress={toggleFavorite}
      disabled={isLoading}
      style={isLoading && { opacity: 0.6 }}
    >
      <Heart
        name={isFavorite ? "heart" : "heart-outline"}
        size={32}
        color={isFavorite ? colors.accent1 : colors.txtColor}
      />
    </Pressable>
  );
}
