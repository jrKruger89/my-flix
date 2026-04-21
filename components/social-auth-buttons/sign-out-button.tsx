import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function SignOutButton() {
  const router = useRouter();

  async function onSignOutButtonPress() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    router.replace("/");
  }
  return (
    <Pressable style={styles.logoutButton} onPress={onSignOutButtonPress}>
      <Text style={styles.logoutText}>Log Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
