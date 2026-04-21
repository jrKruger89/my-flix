// components/FavoriteButton.tsx
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

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
  const { claims } = useAuthContext(); // or use profile/isLoggedIn depending on what you need
  const userId = claims?.sub; // The user ID is in claims.sub
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already favorited
  useEffect(() => {
    if (!userId) return;

    async function checkFavorite() {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType)
        .single();

      setIsFavorite(!!data);
    }

    checkFavorite();
  }, [userId, mediaId, mediaType]);

  async function toggleFavorite() {
    if (!userId) return;

    setIsLoading(true);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType);

      if (!error) {
        setIsFavorite(false);
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

      if (!error) {
        setIsFavorite(true);
      }
    }

    setIsLoading(false);
  }

  return (
    <Pressable
      onPress={toggleFavorite}
      disabled={isLoading}
      style={[
        styles.button,
        isFavorite && styles.buttonFavorited,
        isLoading && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.text, isFavorite && styles.textFavorited]}>
        {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3b3b4d",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonFavorited: {
    backgroundColor: "#b73ad0",
  },
  text: {
    color: "#e8e8f0",
    fontSize: 16,
    fontWeight: "600",
  },
  textFavorited: {
    color: "#f1f1f7",
  },
});
