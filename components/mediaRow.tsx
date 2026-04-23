import MediaCard from "@/components/MediaCard";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MediaRow({
  title,
  mediaArray,
  handleMediaPress,
  emptyMessage,
}: {
  title: string;
  mediaArray: any[];
  handleMediaPress: (id: string) => void;
  emptyMessage?: string;
}) {
  return (
    <>
      <Text style={styles.rowTitle}>{title}</Text>
      {mediaArray.length === 0 && emptyMessage ? (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      ) : (
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
      )}
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
  },
  cardWrapper: {
    marginHorizontal: 8,
    borderRadius: 10,
    overflow: "hidden",
    width: 140,
  },
  emptyText: {
    color: "#fff",
    marginBottom: 15,
  },
});
