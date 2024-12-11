import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          animation: "slide_from_right",
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
