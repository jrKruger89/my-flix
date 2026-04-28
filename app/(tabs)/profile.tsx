import { ScreenWrapper } from "@/components/ScreenWrapper";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { bottom_padding } from "@/constants/theme";
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
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Type for user's favorite media items (movies/TV shows)
type FavoriteItem = {
  id: number;
  media_id: number;
  media_type: "movie" | "tv";
  title: string | null;
  poster_path: string | null;
  created_at: string;
};

// Type for user's written reviews
type ReviewItem = {
  id: number;
  media_id: number;
  media_type: "movie" | "tv";
  review: string;
  created_at: string;
  media_title: string | null;
};

export default function ProfileScreen() {
  // Get authenticated user info and profile data from auth context
  const { claims, profile } = useAuthContext();
  const userId = claims?.sub;

  // Track which tab is active (favorites or reviews)
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews">(
    "favorites",
  );

  // Avatar URL state and upload loading state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url ?? null,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Data storage for user's favorites and reviews
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // Loading states for async data fetching
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe area insets for notch/safe zone handling
  const insets = useSafeAreaInsets();

  // Router for navigation
  const router = useRouter();

  // Derive display name from profile username or email
  const displayName = useMemo(() => {
    if (profile?.username) return profile.username;
    const email = claims?.email as string | undefined;
    if (email?.includes("@")) return email.split("@")[0];
    return "User";
  }, [profile?.username, claims?.email]);

  // Navigate back to home (tabs layout)
  function goToHome() {
    router.replace("/(tabs)");
  }

  // Refresh profile data (favorites and reviews)
  async function refreshProfileData() {
    if (!userId) {
      Alert.alert(
        "Unable to refresh",
        "Please sign in to refresh profile data.",
      );
      return;
    }
    await Promise.all([loadFavorites(), loadReviews()]);
    Alert.alert("Refreshed", "Profile data updated.");
  }

  // Fetch user's favorite media from Supabase
  async function loadFavorites() {
    if (!userId) return;
    setLoadingFavorites(true);
    setError(null);

    try {
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
    } catch (e: any) {
      console.error("Failed to load favorites:", e);
      setError(e?.message || "Failed to load favorites");
    } finally {
      setLoadingFavorites(false);
    }
  }

  // Fetch user's reviews from Supabase
  async function loadReviews() {
    if (!userId) return;
    setLoadingReviews(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, media_id, media_type, review, created_at, media_title")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setReviews((data ?? []) as ReviewItem[]);
      }
    } catch (e: any) {
      console.error("Failed to load reviews:", e);
      setError(e?.message || "Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  }

  // Handle avatar selection, upload to Supabase, and cleanup
  async function onChangeAvatarPress() {
    if (!userId) return;

    // Request photo library permissions
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    // Launch image picker with 1:1 aspect ratio constraint
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (picked.canceled || !picked.assets?.length) return;

    try {
      setIsUploadingAvatar(true);
      setError(null);

      const asset = picked.assets[0];
      // Extract and validate file extension from MIME type
      const mimeType = asset.mimeType ?? "image/jpeg";
      const extFromMime = mimeType.split("/")[1] || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(extFromMime)
        ? extFromMime
        : "jpg";

      // Use stable storage path (per-user key, no timestamps to avoid orphans)
      const storagePath = userId + "/avatar." + safeExt;

      // Save previous avatar URL for cleanup after successful upload
      const previousUrl = profile?.avatar_url ?? null;

      // Platform-specific file handling (web uses Blob, native uses URI)
      let fileData: any;

      if (Platform.OS === "web") {
        // On web, fetch the blob from the data URL
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        fileData = blob;
      } else {
        // On native, use the URI directly (Expo handles file reading)
        fileData = {
          uri: asset.uri,
          type: mimeType,
          name: `avatar.${safeExt}`,
        };
      }

      // Wrap file in FormData for multipart upload
      const formData = new FormData();
      formData.append("file", fileData);

      // Upload to Supabase with upsert (overwrites old file at same path)
      const upload = await supabase.storage
        .from("avatars")
        .upload(storagePath, formData as any, {
          contentType: mimeType,
          upsert: true,
          cacheControl: "3600",
        });
      if (upload.error) throw upload.error;

      // Get public CDN URL for new avatar
      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(storagePath);
      const publicUrl = publicData.publicUrl;

      // Add cache-bust query param for immediate UI refresh
      const displayUrl = publicUrl + "?t=" + Date.now();

      // Update user's profile with new avatar URL
      const update = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (update.error) throw update.error;

      // Clean up previous avatar only after new one is confirmed in DB
      if (previousUrl) {
        const marker = "/storage/v1/object/public/avatars/";
        const i = previousUrl.indexOf(marker);
        if (i !== -1) {
          // Extract storage path from public URL
          const oldPath = previousUrl.slice(i + marker.length).split("?")[0];
          // Only delete if different from new path
          if (oldPath && oldPath !== storagePath) {
            const removeResult = await supabase.storage
              .from("avatars")
              .remove([oldPath]);
            if (removeResult.error) {
              console.warn(
                "Failed to remove previous avatar:",
                removeResult.error,
              );
            }
          }
        }
      }

      // Update local state and show success
      setAvatarUrl(displayUrl);
      Alert.alert("Success", "Profile picture updated.");
    } catch (e: any) {
      console.error("Avatar upload failed:", e);
      Alert.alert("Avatar upload failed", e?.message || "Unknown error");
      setError(e?.message || "Failed to update avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  // Load favorites and reviews when userId becomes available
  useEffect(() => {
    if (!userId) return;
    loadFavorites();
    loadReviews();
  }, [userId]);

  // Sync avatar URL when profile updates
  useEffect(() => {
    setAvatarUrl(profile?.avatar_url ?? null);
  }, [profile?.avatar_url]);

  // Navigate to media detail screen
  function openMediaDetail(mediaId: number, mediaType: "movie" | "tv") {
    router.push({
      pathname: "/media/[detail]",
      params: { detail: String(mediaId), type: mediaType },
    });
  }

  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom_padding }}
        >
          {/* Header with back button, title, and refresh button */}
          <View style={styles.headerRow}>
            <Pressable style={styles.iconButton} onPress={goToHome}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>

            <Text style={styles.headerTitle}>Profile</Text>

            <Pressable
              style={styles.settingsButton}
              onPress={refreshProfileData}
            >
              <Ionicons name="refresh-outline" size={22} color="#fff" />
            </Pressable>
          </View>

          {/* Avatar with edit button */}
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

            {/* Camera badge with loading spinner during upload */}
            <View style={styles.avatarEditBadge}>
              {isUploadingAvatar ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={14} color="#fff" />
              )}
            </View>
          </Pressable>

          {/* Display name */}
          <Text style={styles.name}>{displayName}</Text>

          {/* Stats row showing favorites and reviews count */}
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

          {/* Tab navigation (Favorites/Reviews) */}
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

          {/* Tab content - shows either favorites or reviews based on active tab */}
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
                    {item.media_type.toUpperCase()} •{" "}
                    {item.media_title || "Unknown"}
                  </Text>
                  <Text style={styles.reviewText}>{item.review}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Sign out button */}
          <SignOutButton />
        </ScrollView>
      </ScreenWrapper>
    </LinearGradient>
  );
}

// Styles for the profile screen
const styles = StyleSheet.create({
  // Main container with gradient background
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },
  // Header row layout
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
  // Avatar styles
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignSelf: "center",
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
  // Stats display
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
  // Tab navigation styles
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
  // Tab content area
  tabContent: {
    marginTop: 18,
    marginBottom: 32,
  },
  emptyText: {
    color: "#d7d7e6",
    fontSize: 14,
  },
  // List item card styles
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
  // Avatar wrapper and badge
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
