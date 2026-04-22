import { ScreenWrapper } from "@/components/ScreenWrapper";
import MediaRow from "@/components/mediaRow";
import { useMediaData } from "@/hooks/use-media-data";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
/**
 * Home Screen (Index) - The landing page of the application
 * Displays welcome content and provides navigation to other screens
 * Uses React Native components for cross-platform mobile UI
 */
export default function Index() {
  const { mediaArray, loading, error, handleMediaPress } = useMediaData();
  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScreenWrapper>
        <ScrollView>
          <View style={styles.container}>
            <MediaRow
              title="Currently Watching"
              mediaArray={mediaArray}
              handleMediaPress={handleMediaPress}
            />
            <MediaRow
              title="Watchlist"
              mediaArray={mediaArray}
              handleMediaPress={handleMediaPress}
            />
            <MediaRow
              title="Recommended"
              mediaArray={mediaArray}
              handleMediaPress={handleMediaPress}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </LinearGradient>
  );
}

// StyleSheet: Optimized way to define styles in React Native
// Creates optimized style objects that are compiled to native platform styles
const styles = StyleSheet.create({
  // container: Main view container styles
  container: {
    flex: 1,
    padding: 10,
  },
  cardWrapper: {
    marginHorizontal: 10,

    borderRadius: 10,
    overflow: "hidden",
    width: 140,
  },
});
