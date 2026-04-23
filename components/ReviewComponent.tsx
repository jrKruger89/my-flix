// components/ReviewComponent.tsx
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Review {
  id: number;
  user_id: string;
  review: string;
  rating: number;
  created_at: string;
  helpful_count: number;
  username?: string;
}

interface ReviewComponentProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  mediaTitle: string;
}

export default function ReviewComponent({
  mediaId,
  mediaType,
  mediaTitle,
}: ReviewComponentProps) {
  const { claims } = useAuthContext();
  const userId = claims?.sub;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select(
          `
          id,
          user_id,
          review,
          rating,
          created_at,
          helpful_count,
          profiles(username)
        `,
        )
        .eq("media_id", mediaId)
        .eq("media_type", mediaType)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const mappedReviews =
        data?.map((r: any) => ({
          ...r,
          username: r.profiles?.username || "Anonymous",
        })) || [];

      setReviews(mappedReviews);
      setReviewCount(mappedReviews.length);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [mediaId, mediaType]);

  const loadReviewCount = useCallback(async () => {
    try {
      const { count, error: countError } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("media_id", mediaId)
        .eq("media_type", mediaType);

      if (countError) throw countError;

      setReviewCount(count ?? 0);
    } catch (err) {
      console.error("Failed to load review count:", err);
    }
  }, [mediaId, mediaType]);

  useEffect(() => {
    setHasLoadedOnce(false);
    setReviews([]);
    setReviewCount(0);
    setError(null);
    setIsExpanded(false);
  }, [mediaId, mediaType]);

  useEffect(() => {
    loadReviewCount();
  }, [loadReviewCount]);

  useEffect(() => {
    if (!isExpanded || hasLoadedOnce) return;

    loadReviews().finally(() => {
      setHasLoadedOnce(true);
    });
  }, [isExpanded, hasLoadedOnce, loadReviews]);

  async function submitReview() {
    if (!userId || !newReview.trim()) return;

    const parsedRating = Number.parseInt(newRating, 10);
    const isRatingValid =
      Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 10;

    if (!isRatingValid) {
      setError("Please enter a rating between 1 and 10.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { error: submitError } = await supabase.from("reviews").insert({
        user_id: userId,
        media_id: mediaId,
        media_type: mediaType,
        media_title: mediaTitle,
        review: newReview.trim(),
        rating: parsedRating,
      });

      if (submitError) throw submitError;

      setNewReview("");
      setNewRating("");
      await loadReviews();
      await loadReviewCount();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview(reviewId: number) {
    try {
      const { error: deleteError } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      await loadReviewCount();
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Failed to delete review");
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.collapseHeader}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <Text style={styles.heading}>Reviews ({reviewCount})</Text>
        <Text style={styles.collapseToggle}>
          {isExpanded ? "Hide" : "Show"}
        </Text>
      </Pressable>

      {!isExpanded ? null : (
        <View style={styles.expandedContent}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="small" color="#b73ad0" />
            </View>
          ) : (
            <>
              {/* Add Review Form */}
              {userId && (
                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.ratingInput}
                    placeholder="Rating (1-10)"
                    placeholderTextColor="#9d9daf"
                    value={newRating}
                    onChangeText={setNewRating}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Write a review..."
                    placeholderTextColor="#9d9daf"
                    value={newReview}
                    onChangeText={setNewReview}
                    multiline
                    numberOfLines={4}
                  />
                  <Pressable
                    style={[
                      styles.submitButton,
                      submitting && { opacity: 0.6 },
                    ]}
                    onPress={submitReview}
                    disabled={
                      submitting || !newReview.trim() || !newRating.trim()
                    }
                  >
                    <Text style={styles.submitText}>
                      {submitting ? "Posting..." : "Post Review"}
                    </Text>
                  </Pressable>
                </View>
              )}

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Reviews List */}
              <ScrollView style={styles.reviewsList}>
                {reviews.length === 0 ? (
                  <Text style={styles.noReviews}>
                    No reviews yet. Be the first!
                  </Text>
                ) : (
                  reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.username}>{review.username}</Text>
                        <View style={styles.reviewMeta}>
                          <Text style={styles.ratingBadge}>
                            ★ {review.rating}/10
                          </Text>
                          <Text style={styles.date}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.reviewText}>{review.review}</Text>
                      {userId === review.user_id && (
                        <Pressable
                          onPress={() => deleteReview(review.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f1f1f7",
  },
  collapseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  collapseToggle: {
    color: "#b73ad0",
    fontSize: 14,
    fontWeight: "600",
  },
  expandedContent: {
    paddingTop: 8,
  },
  formContainer: {
    marginBottom: 16,
    gap: 8,
  },
  ratingInput: {
    backgroundColor: "#dfdfdf",
    borderWidth: 2,
    borderColor: "#b73ad0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1f1f1f",
  },
  input: {
    backgroundColor: "#dfdfdf",
    borderWidth: 2,
    borderColor: "#b73ad0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1f1f1f",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#b73ad0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#f1f1f7",
    fontWeight: "600",
    fontSize: 14,
  },
  reviewsList: {
    maxHeight: 400,
  },
  reviewCard: {
    backgroundColor: "#2a2a3e",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewMeta: {
    alignItems: "flex-end",
    gap: 2,
  },
  ratingBadge: {
    color: "#f7d66b",
    fontSize: 12,
    fontWeight: "600",
  },
  username: {
    fontWeight: "600",
    color: "#b73ad0",
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#9d9daf",
  },
  reviewText: {
    color: "#e8e8f0",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "600",
  },
  noReviews: {
    textAlign: "center",
    color: "#9d9daf",
    fontSize: 14,
    marginTop: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 8,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});
