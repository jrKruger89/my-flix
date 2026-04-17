import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        K2D: require("../../assets/fonts/K2D-Regular.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.rowTitle}>Currently Watching</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
        </ScrollView>

        <Text style={styles.rowTitle}>Watchlist</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
        </ScrollView>

        <Text style={styles.rowTitle}>Recommended</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://thispersondoesnotexist.com/" }}
              style={styles.image}
            />
            <Text style={styles.movieTitle}>Movie Title</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
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
