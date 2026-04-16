import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const MENU_ITEMS = [
  "Saved filmography",
  "My reviews",
  "My Movies",
  "My shows",
  "My FilmClubs",
];

export default function ProfileScreen() {
  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.squareIcon} />
      </View>

      <Image
        source={require("../../assets/images/MrBaggins.jpg")}
        style={styles.avatar}
      />

      <Text style={styles.name}>Mr. Underhill</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color={"#d7d7e6"} />
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color={"#d7d7e6"} />
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={16} color={"#d7d7e6"} />
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.menuBlock}>
        {MENU_ITEMS.map((item) => (
          <Text key={item} style={styles.menuText}>
            {item}
          </Text>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#f1f1f7",
    fontSize: 32,
    fontWeight: "600",
  },
  squareIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#d6d6d6",
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignSelf: "center",
    marginTop: 26,
    borderWidth: 2,
    borderColor: "#ffffff22",
  },
  name: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 22,
  },
  statsRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 5,
  },
  statLabel: {
    color: "#d7d7e6",
    fontSize: 15,
  },
  menuBlock: {
    marginTop: 48,
    gap: 18,
  },
  menuText: {
    color: "#F0F0F0",
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "K2D_400Regular",
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 22,
    alignSelf: "center",
    backgroundColor: "#b138cf",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
