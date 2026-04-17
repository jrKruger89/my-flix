import { colors, fonts } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

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
}: DetailCardProps) {
  return (
    // View: Root container for all detail content
    // Organizes all child elements (poster, text, metadata) vertically
    <View>
      {/* 
        Image: React Native component for displaying images
        source prop takes object with uri key containing image URL
        Renders remote images efficiently with caching
      */}
      <Image
        source={{ uri: poster }}
        style={styles.poster} // Large 400px tall image with rounded corners
      />

      {/* 
        Title text: Large, prominent heading for the media name
        Uses K2D-Regular font from theme for consistency
      */}
      <Text style={styles.title}>{title}</Text>

      {/* 
        Rating display: Shows numeric rating with star emoji
        Uses accent color (purple #B030B0) to stand out
        Format: ★ 9.3/10
      */}
      <Text style={styles.rating}>★ {rating}/10</Text>

      {/* 
        Conditional rendering: Display play time only if it exists
        Shows movie duration in human-readable format
        Uses && operator to check if playTime exists before rendering
      */}
      {playTime && <Text style={styles.details}>Duration: {playTime}</Text>}

      {/* 
        Release year: Shows year media was released
        Always rendered as it's typically available in mock data
      */}
      <Text style={styles.details}>Release: {releaseYear}</Text>

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
        ID display: Shows unique identifier
        Useful for debugging or API integration
        Small, subtle styling so it doesn't distract from main content
      */}
      <Text style={styles.id}>ID: {id}</Text>
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
});
