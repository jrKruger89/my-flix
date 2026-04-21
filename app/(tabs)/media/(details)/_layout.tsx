import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable to use parent (tabs) header
        headerTitle: "Details",
      }}
    />
  );
}
