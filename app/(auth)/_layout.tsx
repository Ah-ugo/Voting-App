import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
