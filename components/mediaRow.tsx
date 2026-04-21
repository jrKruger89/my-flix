import MediaCard from "@/components/MediaCard";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MediaRow({ title, mediaArray, handleMediaPress }) {
  return (
    <>
      <Text style={styles.rowTitle}>{title}</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollRow}>
        {mediaArray.map((item) => (
          <Pressable key={item.id} onPress={() => handleMediaPress(item.id)}>
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
    </>
  );
}

const styles = StyleSheet.create({
  rowTitle: {
    color: "#fff",
    fontSize: 23,
    marginVertical: 10,
    fontFamily: "K2D-Regular",
  },
  scrollRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  cardWrapper: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    width: 140,
  },
});
