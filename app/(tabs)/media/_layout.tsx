import { colors, fonts } from "@/constants/theme";
import { Stack } from "expo-router";

export default function MediaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[detail]"
        options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: colors.bgColor,
          },
          headerTintColor: colors.txtColor,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: fonts.semiBold,
            color: colors.txtColor,
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}
