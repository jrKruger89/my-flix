import MediaCard from "@/components/MediaCard";
import { fonts } from "@/constants/theme";
import { useMediaData } from "@/hooks/use-media-data";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.rowTitle}>Currently Watching</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.scrollRow}
          >
            {mediaArray.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleMediaPress(item.id)}
              >
                <View style={styles.cardWrapper}>
                  <MediaCard
                    id={item.id}
                    title={item.title}
                    poster={item.poster}
                    rating={item.rating}
                  />
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.rowTitle}>Watchlist</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.scrollRow}
          >
            {mediaArray.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleMediaPress(item.id)}
                style={styles.image}
              >
                <MediaCard
                  id={item.id}
                  title={item.title}
                  poster={item.poster}
                  rating={item.rating}
                />
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.rowTitle}>Recommended</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.scrollRow}
          >
            {mediaArray.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleMediaPress(item.id)}
                style={styles.image}
              >
                <MediaCard
                  id={item.id}
                  title={item.title}
                  poster={item.poster}
                  rating={item.rating}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  rowTitle: {
    color: "#fff",
    fontSize: 20,
    marginVertical: 10,
    fontFamily: fonts.regular,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 15,
    marginVertical: 10,
    fontFamily: fonts.regular,
  },
  scrollRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  // image: {
  //   width: 140,
  //   height: 200,
  //   borderRadius: 10,
  //   marginHorizontal: 10,
  // },
  cardWrapper: {
    marginHorizontal: 10,

    borderRadius: 10,
    overflow: "hidden",
    width: 140,
  },
});
