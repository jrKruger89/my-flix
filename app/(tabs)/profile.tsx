import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FavoriteItem = {
  id: number;
  media_id: number;
  media_type: "movie" | "tv";
  title: string | null;
  poster_path: string | null;
  created_at: string;
};

type ReviewItem = {
  id: number;
  media_id: number;
  media_type: "movie" | "tv";
  review: string;
  created_at: string;
};

export default function ProfileScreen() {
  const { claims, profile } = useAuthContext();
  const userId = claims?.sub;
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews">(
    "favorites",
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url ?? null,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const displayName = useMemo(() => {
    if (profile?.username) return profile.username;
    const email = claims?.email as string | undefined;
    if (email?.includes("@")) return email.split("@")[0];
    return "User";
  }, [profile?.username, claims?.email]);

  async function loadFavorites() {
    if (!userId) return;
    setLoadingFavorites(true);
    setError(null);

    const { data, error } = await supabase
      .from("favorites")
      .select("id, media_id, media_type, title, poster_path, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setFavorites((data ?? []) as FavoriteItem[]);
    }

    setLoadingFavorites(false);
  }

  async function loadReviews() {
    if (!userId) return;
    setLoadingReviews(true);
    setError(null);

    const { data, error } = await supabase
      .from("reviews")
      .select("id, media_id, media_type, review, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setReviews((data ?? []) as ReviewItem[]);
    }

    setLoadingReviews(false);
  }

  async function onChangeAvatarPress() {
    if (!userId) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (picked.canceled || !picked.assets?.length) return;

    try {
      setIsUploadingAvatar(true);
      setError(null);

      const asset = picked.assets[0];
      const mimeType = asset.mimeType ?? "image/jpeg";
      const extFromMime = mimeType.split("/")[1] || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(extFromMime)
        ? extFromMime
        : "jpg";

      const fileName = "avatar-" + Date.now() + "." + safeExt;
      const storagePath = userId + "/" + fileName;

      const fileRes = await fetch(asset.uri);
      const fileBlob = await fileRes.blob();

      const upload = await supabase.storage
        .from("avatars")
        .upload(storagePath, fileBlob, {
          contentType: mimeType,
          upsert: true,
        });

      if (upload.error) throw upload.error;

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(storagePath);

      const publicUrl = publicData.publicUrl;

      const update = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (update.error) throw update.error;

      setAvatarUrl(publicUrl);
      Alert.alert("Success", "Profile picture updated.");
    } catch (e: any) {
      console.error("Avatar upload failed:", e);
      Alert.alert("Avatar upload failed", e?.message || "Unknown error");
      setError(e?.message || "Failed to update avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  useEffect(() => {
    if (!userId) return;
    loadFavorites();
    loadReviews();
  }, [userId]);

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url ?? null);
  }, [profile?.avatar_url]);

  function openMediaDetail(mediaId: number, mediaType: "movie" | "tv") {
    router.push(`/details/${mediaId}?type=${mediaType}`);
  }

  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Profile</Text>

          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={"#fff"} />
          </Pressable>
        </View>

        <Pressable
          onPress={onChangeAvatarPress}
          disabled={isUploadingAvatar}
          style={styles.avatarWrapper}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color="#d7d7e6" />
            </View>
          )}

          <View style={styles.avatarEditBadge}>
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={14} color="#fff" />
            )}
          </View>
        </Pressable>

        <Text style={styles.name}>{displayName}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color={"#d7d7e6"} />
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color={"#d7d7e6"}
            />
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setActiveTab("favorites")}
            style={[
              styles.tabBtn,
              activeTab === "favorites" && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "favorites" && styles.tabTextActive,
              ]}
            >
              My Favorites
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("reviews")}
            style={[
              styles.tabBtn,
              activeTab === "reviews" && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.tabTextActive,
              ]}
            >
              My Reviews
            </Text>
          </Pressable>
        </View>

        <View style={styles.tabContent}>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {activeTab === "favorites" ? (
            loadingFavorites ? (
              <ActivityIndicator size="small" color="#b73ad0" />
            ) : favorites.length === 0 ? (
              <Text style={styles.emptyText}>No favorites yet.</Text>
            ) : (
              favorites.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.listCard}
                  onPress={() =>
                    openMediaDetail(item.media_id, item.media_type)
                  }
                >
                  <Text style={styles.listTitle}>
                    {item.title || "Untitled"}
                  </Text>
                  <Text style={styles.listMeta}>
                    {item.media_type.toUpperCase()} • ID {item.media_id}
                  </Text>
                </Pressable>
              ))
            )
          ) : loadingReviews ? (
            <ActivityIndicator size="small" color="#b73ad0" />
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet.</Text>
          ) : (
            reviews.map((item) => (
              <View key={item.id} style={styles.listCard}>
                <Text style={styles.listMeta}>
                  {item.media_type.toUpperCase()} • ID {item.media_id}
                </Text>
                <Text style={styles.reviewText}>{item.review}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>
        <SignOutButton />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#f1f1f7",
    fontSize: 32,
    fontWeight: "600",
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignSelf: "center",
    marginTop: 26,
    borderWidth: 2,
    borderColor: "#ffffff22",
  },
  name: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 22,
  },
  statsRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 5,
  },
  statLabel: {
    color: "#d7d7e6",
    fontSize: 15,
  },
  settingsButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#ffffff1f",
  },
  tabRow: {
    marginTop: 24,
    flexDirection: "row",
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ffffff22",
    backgroundColor: "#ffffff10",
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#b73ad0",
    borderColor: "#b73ad0",
  },
  tabText: {
    color: "#d7d7e6",
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabContent: {
    marginTop: 18,
    marginBottom: 32,
  },
  emptyText: {
    color: "#d7d7e6",
    fontSize: 14,
  },
  listCard: {
    backgroundColor: "#ffffff12",
    borderWidth: 1,
    borderColor: "#ffffff1f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  listTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listMeta: {
    color: "#d7d7e6",
    marginTop: 4,
    fontSize: 13,
  },
  reviewText: {
    color: "#f1f1f7",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  dateText: {
    color: "#b8b8ca",
    marginTop: 8,
    fontSize: 12,
  },
  errorText: {
    color: "#ffd4d4",
    marginBottom: 10,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginTop: 26,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff14",
  },
  avatarEditBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#b73ad0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff55",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
