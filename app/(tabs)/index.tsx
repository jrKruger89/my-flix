import MediaCard from "@/components/MediaCard";
import { useMediaData } from "@/hooks/use-media-data";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
/**
 * Home Screen (Index) - The landing page of the application
 * Displays welcome content and provides navigation to other screens
 * Uses React Native components for cross-platform mobile UI
 */
export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { mediaArray, loading, error, handleMediaPress } = useMediaData();

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      await Font.loadAsync({
        K2D: require("../../assets/fonts/K2D-Regular.ttf"),
      });
      if (isMounted) {
        setFontsLoaded(true);
      }
    };

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
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
    fontFamily: "K2D",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 15,
    marginVertical: 10,
    fontFamily: "K2D",
  },
  scrollRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 130,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
