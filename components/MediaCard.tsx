import { colors, fonts } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

/**
 * MediaCardProps - TypeScript interface for MediaCard component props
 * Defines the minimal set of data needed to display a media item in grid view
 * All properties except id are optional to handle missing data gracefully
 */
interface MediaCardProps {
  id: string; // Unique identifier for the media item
  title?: string; // Short or full movie title
  poster?: string; // URL to the poster/cover image
  rating?: number; // Numerical rating (e.g., 9.3)
}

/**
 * MediaCard - Compact card component for displaying media in a grid
 * Used in the Media screen's FlatList to show movie previews
 * Optimized for small screen real estate in 2-column layouts
 * Tap this card to navigate to the full detail view
 */
export default function MediaCard({
  id,
  title,
  poster,
  rating,
}: MediaCardProps) {
  return (
    // View: Card container that holds poster, title, and rating
    // Fixed width (48%) ensures proper grid layout with spacing
    <View style={styles.container}>
      {/* 
        Image: Displays the movie poster image
        source prop: Object with uri key containing remote image URL
        Efficient rendering with React Native image caching
        Only render when a poster URL is available to avoid passing
        an undefined uri to React Native Image
      */}
      {poster ? (
        <Image
          source={{ uri: poster }}
          style={styles.poster} // 200px height for grid view
        />
      ) : null}

      {/* 
        Title: Movie name text
        numberOfLines={2}: Truncates title to maximum 2 lines
        Adds '...' ellipsis if text exceeds 2 lines
        Prevents long titles from breaking grid layout
      */}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* 
        Rating: Star emoji followed by numerical rating
        Purple accent color draws attention to this quick metric
        Format: ★ 9.3
      */}
      <Text style={styles.rating}>★ {rating}</Text>
    </View>
  );
}

// StyleSheet: Optimized style collection for MediaCard component
const styles = StyleSheet.create({
  // container: Card wrapper dimensions and spacing
  container: {
    width: "100%", // Each card is 48% of parent width (2 per row)
    marginBottom: 16, // Vertical space between rows
    marginRight: 8, // Horizontal space between cards (48% + 48% + 4% = 100%)
  },

  // poster: Styling for the movie poster image
  poster: {
    width: "100%", // Stretch to container width
    height: 200, // Fixed height for grid consistency (smaller than detail)
    borderRadius: 8, // Rounded corners (8px) for modern appearance
    marginBottom: 8, // Space below image for title and rating
  },

  // title: Styling for the movie title text
  title: {
    fontFamily: fonts.regular, // K2D-Regular from theme constants
    fontSize: 12, // Small text size suitable for compact cards
    color: colors.txtColor, // Light color (#F0F0F0) for readability
    marginBottom: 4, // Small space before rating
  },

  // rating: Styling for the star rating display
  rating: {
    fontFamily: fonts.regular, // K2D-Regular from theme
    fontSize: 11, // Very small text for compact display
    color: colors.accent1, // Purple accent color (#B030B0) stands out on dark bg
  },
});
