import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Log In",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="home/[user_id]"
        options={{
          headerTitle: "Home Page",
        }}
      />
      <Stack.Screen
        name="spotify/[user_id]"
        options={{
          headerTitle: "Spotify API Page",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
