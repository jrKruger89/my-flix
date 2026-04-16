import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.rowTitle}>Row 1</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
      </ScrollView>

      <Text style={styles.rowTitle}>Row 2</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
      </ScrollView>

      <Text style={styles.rowTitle}>Row 3</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
        <View>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.image}
          />
          <Text style={styles.rowTitle}>Movie Title</Text>
        </View>
      </ScrollView>
    </View>
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
    fontSize: 18,
    marginVertical: 10,
  },
  scrollRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
