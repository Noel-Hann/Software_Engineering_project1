import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

const RootLayout = () => {
  return (
    <SQLiteProvider databaseName="example.db">
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
        {/* <Stack.Screen
          name="PlayList/playlist"
          options={{
            headerTitle: "Play list pag",
            headerShown: false,
          }}
        /> */}
      </Stack>
    </SQLiteProvider>
  );
};

export default RootLayout;
