import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.backButton}>
      <Text style={styles.backButtonText}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.txtColor,
    textAlignVertical: "center",
    lineHeight: 28,
  },
});
