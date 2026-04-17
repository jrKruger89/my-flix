import MediaCard from "@/components/MediaCard";
import { colors } from "@/constants/theme";
import { mockMediaEntries } from "@/data/mockMedia";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

/**
 * Media Screen - Displays a grid of media items (movies)
 * Shows movies in a 2-column grid layout with tap-to-navigate functionality
 * Uses FlatList for efficient rendering of large lists of media items
 */
export default function MediaScreen() {
  // useRouter hook: Returns navigation router instance from expo-router
  // Allows programmatic navigation using router.push(route)
  const router = useRouter();

  // Convert mock data object (keyed by property names) into array
  // FlatList requires an array, so Object.values() extracts just the movie objects
  // Example: { movie1: {...}, movie2: {...} } => [{...}, {...}]
  const mediaArray = Object.values(mockMediaEntries);

  /**
   * handleMediaPress - Handler function for when a media card is pressed
   * Uses router.push() for navigation to the detail page with dynamic route
   * @param id {string} - The unique identifier of the selected media item
   */
  const handleMediaPress = (id: string) => {
    // Push new screen to navigation stack with ID as URL parameter
    // Navigates to /details/1, /details/2, etc. based on selected item
    router.push(`/details/${id}`);
  };

  return (
    // View: Root container for the entire media grid screen
    <View style={styles.container}>
      {/* 
        FlatList: Efficient list component from React Native
        Renders large lists with virtual scrolling (only renders visible items)
        Perfect for grids when combined with numColumns prop
      */}
      <FlatList
        data={mediaArray} // Array of media items to render
        numColumns={2} // Display 2 items per row (creates grid)
        keyExtractor={(item) => item.id} // Unique key for each list item
        columnWrapperStyle={styles.row} // Styling for row container
        contentContainerStyle={styles.listContent} // Styling for list content area
        // renderItem: Function that renders each item in the list
        // Receives { item, index } in the parameter object
        renderItem={({ item }) => (
          // Pressable: Touch-responsive wrapper component
          // Detects tap/press interactions and triggers onPress callback
          <Pressable
            onPress={() => handleMediaPress(item.id)} // Navigate when pressed
            style={styles.cardWrapper} // Size wrapper for grid layout
          >
            {/* 
              MediaCard: Reusable card component displaying movie info
              Shows poster image, title, and rating in compact format
            */}
            <MediaCard
              id={item.id} // Movie unique identifier
              title={item.title} // Movie title text
              poster={item.poster} // Movie poster image URL
              rating={item.rating} // Movie rating number
            />
          </Pressable>
        )}
      />
    </View>
  );
}

// StyleSheet: Optimized style definitions for media screen
const styles = StyleSheet.create({
  // container: Main screen container
  // Fills entire available space with dark background
  container: {
    flex: 1, // Take up all available vertical space
    backgroundColor: colors.bgColor, // Dark background (#202040)
  },

  // listContent: Padding around the entire FlatList content
  // Adds 16 units of space on all sides (top, right, bottom, left)
  listContent: {
    padding: 16,
  },

  // row: Styling for the horizontal row wrapper of each pair of items
  // Distributes items evenly with space between them
  row: {
    justifyContent: "space-between", // Equal space between left and right cards
  },

  // cardWrapper: Container for each media card in the grid
  // Uses 48% width (2 items fit with space between)
  cardWrapper: {
    width: "48%", // Each card takes ~48% width, leaving ~4% gap between
  },
});
