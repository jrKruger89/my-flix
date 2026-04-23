import { colors, fonts } from "@/constants/theme";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FavoriteButton from "./FavoriteButton";

import { useWatchProgress } from "@/hooks/use-watch-progress";
import ProgressBar from "./ProgressBar";

/**
 * DetailCardProps - TypeScript interface defining all optional props for DetailCard
 * Makes the component type-safe and enables IDE autocomplete
 * All properties are optional (?) to handle missing data gracefully
 */
interface DetailCardProps {
  id: string; // Unique identifier for the media item
  title?: string; // Movie/media title
  poster?: string; // URL to poster image
  rating?: number; // Numerical rating (e.g., 9.3/10)
  releaseYear?: number; // Year the media was released
  cast?: string[]; // Array of actor names
  director?: string[]; // Array of director names
  description?: string[]; // Array of description paragraphs
  playTime?: string; // Duration text (e.g., "142 minutes")
  mediaType?: "movie" | "tv"; // Add this to differentiate
  numberOfSeasons?: number; // TV only
  numberOfEpisodes?: number; // TV only
  network?: string; // TV only
}

/**
 * DetailCard - Reusable component displaying comprehensive media details
 * Shows poster, title, rating, metadata (year, director, cast), and description
 * Handles optional fields gracefully - only renders if data is available
 */
export default function DetailCard({
  id,
  title,
  poster,
  rating,
  releaseYear,
  cast,
  director,
  description,
  playTime,
  mediaType,
  numberOfSeasons,
  numberOfEpisodes,
  network,
}: DetailCardProps) {
  const { progress, updateProgress, clearProgress } = useWatchProgress(
    parseInt(id),
    mediaType || "movie",
  );
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("0");

  const parsePlayTimeMinutes = (duration?: string) => {
    if (!duration || duration === "Unknown") return 0;

    const match = duration.match(/(?:(\d+)h\s*)?(\d+)m/);
    if (match) {
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      return hours * 60 + minutes;
    }

    const fallbackMinutes = parseInt(duration, 10);
    return Number.isNaN(fallbackMinutes) ? 0 : fallbackMinutes;
  };

  const playTimeMinutes = parsePlayTimeMinutes(playTime);

  const handleUpdateProgress = () => {
    const minutes = parseInt(inputMinutes) || 0;
    if (minutes < 0 || minutes > playTimeMinutes) {
      Alert.alert(
        "Invalid",
        `Enter a value between 0 and ${playTimeMinutes} minutes`,
      );
      return;
    }
    updateProgress(minutes, playTimeMinutes);
    setShowProgressModal(false);
    setInputMinutes("0");
  };

  return (
    // View: Root container for all detail content
    // Organizes all child elements (poster, text, metadata) vertically
    <View>
      {/* 
        Image: React Native component for displaying images
        Only renders when a poster URL exists so `uri` is always a string
        and missing poster data is handled gracefully
      */}
      <View style={styles.posterContainer}>
        {poster && (
          <Image
            source={{ uri: poster }}
            style={styles.poster} // Large 400px tall image with rounded corners
          />
        )}
        {title && (
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton
              mediaId={parseInt(id)}
              mediaType={mediaType || "movie"}
              title={title}
              posterPath={poster || ""}
            />
          </View>
        )}
      </View>

      {/* 
        Title text: Large, prominent heading for the media name
        Uses K2D-Regular font from theme for consistency
        Only renders when a title is available to avoid displaying undefined
      */}
      {title && <Text style={styles.title}>{title}</Text>}

      {/* 
        Rating display: Shows numeric rating with star emoji
        Uses accent color (purple #B030B0) to stand out
        Format: ★ 9.3/10
        Only renders when rating data is available
      */}
      {rating !== undefined && (
        <Text style={styles.rating}>★ {Math.round(rating)}/10</Text>
      )}

      {/* 
        Conditional rendering: Display play time only if it exists
        Shows movie duration in human-readable format
        Uses && operator to check if playTime exists before rendering
      */}
      {playTime && <Text style={styles.details}>Duration: {playTime}</Text>}

      {/* 
        Release year: Shows year media was released
        Conditional rendering: Only shows if releaseYear is available
      */}
      {releaseYear !== undefined && (
        <Text style={styles.details}>Release: {releaseYear}</Text>
      )}

      {/* 
        Director(s): Displays names of all directors
        Conditional rendering: Only shows if array exists and has items
        join(", ") concatenates multiple names with comma separation
      */}
      {director && director.length > 0 && (
        <Text style={styles.details}>Director: {director.join(", ")}</Text>
      )}

      {/* 
        Cast: Displays names of all actors
        Conditional rendering: Only shows if array exists and has items
        join(", ") separates actor names with commas
      */}
      {cast && cast.length > 0 && (
        <Text style={styles.details}>Cast: {cast.join(", ")}</Text>
      )}

      {/* 
        Description: Full synopsis/plot of the media
        Conditional rendering: Only renders if description exists and has content
        join("\n\n") separates multiple paragraphs with blank lines
        Uses larger font and line height for readability
      */}
      {description && description.length > 0 && (
        <Text style={styles.description}>{description.join("\n\n")}</Text>
      )}

      {/* 
        Seasons: Displays number of seasons (TV only)
        Conditional rendering: Only shows if numberOfSeasons is available
      */}
      {numberOfSeasons !== undefined && (
        <Text style={styles.details}>Seasons: {numberOfSeasons}</Text>
      )}

      {/* 
        Episodes: Displays number of episodes (TV only)
        Conditional rendering: Only shows if numberOfEpisodes is available
      */}
      {numberOfEpisodes !== undefined && (
        <Text style={styles.details}>Episodes: {numberOfEpisodes}</Text>
      )}

      {/* 
        Network: Displays network name (TV only)
        Conditional rendering: Only shows if network is available
      */}
      {network && <Text style={styles.details}>Network: {network}</Text>}

      {/* 
        Watch progress: Displays progress bar for the current watch session
        Only renders if watchProgress is available
      */}
      {progress && playTimeMinutes > 0 && (
        <ProgressBar
          minutesWatched={progress.minutesWatched}
          totalRuntime={playTimeMinutes}
        />
      )}

      {/* 
        Update Progress Button 
        Only renders if playTime is greater than 0
      */}
      {playTimeMinutes > 0 && (
        <View style={styles.progressButtonRow}>
          <TouchableOpacity
            style={styles.updateProgressButton}
            onPress={() => {
              setInputMinutes(progress?.minutesWatched.toString() || "0");
              setShowProgressModal(true);
            }}
          >
            <Text style={styles.updateProgressButtonText}>
              {progress ? "✏️ Update" : "➕ Add"} Progress
            </Text>
          </TouchableOpacity>
          {progress && (
            <TouchableOpacity
              style={styles.clearProgressButton}
              onPress={() => {
                Alert.alert("Clear Progress", "Remove watch progress?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Clear",
                    style: "destructive",
                    onPress: clearProgress,
                  },
                ]);
              }}
            >
              <Text style={styles.clearProgressButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 
        Progress Input Modal 
        Only renders if watchProgress is available
      */}
      <Modal visible={showProgressModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Watch Progress</Text>
            <Text style={styles.modalSubtitle}>
              Minutes watched (0 - {playTimeMinutes}):
            </Text>
            <TextInput
              style={styles.progressInput}
              placeholder="0"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={inputMinutes}
              onChangeText={(text) => {
                const numOnly = text.replace(/[^0-9]/g, "");
                // Allow any number up to playtime
                if (numOnly === "" || parseInt(numOnly) <= playTimeMinutes) {
                  setInputMinutes(numOnly);
                }
              }}
              keyboardType="number-pad"
              editable={true}
            />

            {/* Display formatted time */}
            {inputMinutes !== "" && (
              <View style={styles.timeDisplayContainer}>
                <Text style={styles.timeDisplay}>
                  {Math.floor(parseInt(inputMinutes) / 60)}h{" "}
                  {parseInt(inputMinutes) % 60}m
                </Text>
                <Text style={styles.timeMax}>
                  out of {Math.floor(playTimeMinutes / 60)}h{" "}
                  {playTimeMinutes % 60}m
                </Text>
              </View>
            )}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowProgressModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleUpdateProgress}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// StyleSheet: Optimized style collection for DetailCard component
const styles = StyleSheet.create({
  // poster: Styling for the main poster image
  poster: {
    width: "100%", // Stretch to fill container width
    height: 400, // Fixed height for large preview image
    borderRadius: 8, // Rounded corners (8px radius) for modern look
    marginBottom: 16, // Space below image before next content
  },

  // title: Styling for the movie/media title heading
  title: {
    fontFamily: fonts.regular, // K2D-Regular from theme constants
    fontSize: 24, // Large heading size
    color: colors.txtColor, // Light color (#F0F0F0) for contrast
    marginBottom: 8, // Space below title
  },

  // rating: Styling for the numerical rating display
  // Uses accent color (purple) to draw attention to this key metric
  rating: {
    fontSize: 18, // Prominent text size
    color: colors.accent1, // Purple accent color (#B030B0)
    marginBottom: 12, // Space before following content
  },

  // description: Styling for plot synopsis paragraphs
  description: {
    fontFamily: fonts.regular, // K2D-Regular from theme
    fontSize: 14, // Readable body text size
    color: colors.txtColor, // Light color for readability
    lineHeight: 20, // Extra line spacing for long text readability
    marginBottom: 16, // Space after description section
  },

  // details: Styling for metadata fields (director, cast, duration, etc.)
  details: {
    fontFamily: fonts.regular, // K2D-Regular from theme
    fontSize: 12, // Smaller text size for secondary information
    color: colors.txtColor, // Light color matching main text
    marginBottom: 8, // Space between each detail line
  },

  // id: Styling for the ID field (debugging/integration info)
  // Subtle styling so it doesn't interfere with primary content
  id: {
    fontFamily: fonts.regular, // K2D-Regular from theme
    fontSize: 10, // Very small text - shows it's auxiliary info
    color: colors.txtColor, // Same light color but small size diminishes prominence
  },

  posterContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },

  favoriteButtonContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  watchProgressContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },

  watchProgressButton: {
    position: "relative",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  watchProgressButtonLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.txtColor,
  },

  progressModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  progressModalLabel: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.txtColor,
  },

  progressModalInput: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.txtColor,
    textAlign: "center",
  },

  progressModalButtons: {
    position: "relative",
    top: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  progressModalButton: {
    position: "relative",
    top: 0,
    width: 80,
    height: 30,
    backgroundColor: colors.accent1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  progressModalButtonLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.txtColor,
  },

  progressButtonRow: {
    position: "relative",
    top: 0,
    right: 8,
    zIndex: 10,
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },

  updateProgressButton: {
    position: "relative",
    top: 0,
    width: 80,
    minHeight: 48,
    backgroundColor: colors.accent1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  updateProgressButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: fonts.regular,
    fontWeight: "bold",
    textAlign: "center",
  },

  clearProgressButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  clearProgressButtonText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.bgColor,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    borderWidth: 1,
    borderColor: colors.accent1,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.regular,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: fonts.regular,
    marginBottom: 12,
  },
  progressInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: colors.accent1,
    borderRadius: 8,
    color: "#fff",
    padding: 12,
    marginBottom: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.accent1,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: fonts.regular,
    fontWeight: "bold",
  },
  timeDisplayContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  timeDisplay: {
    color: colors.accent1,
    fontSize: 18,
    fontFamily: fonts.regular,
    fontWeight: "bold",
  },
  timeMax: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
});
