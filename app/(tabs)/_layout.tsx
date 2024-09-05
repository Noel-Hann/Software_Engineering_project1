import { Stack } from "expo-router";

const RootLayout = () => {
  return (<Stack>
    <Stack.Screen name='index' options={{
      headerTitle: 'Log In Page'
    }} />
    <Stack.Screen name='home/[user_id]' options={{
      headerTitle: 'Home Page'
    }} />
    <Stack.Screen name='spotify/[user_id]' options={{
      headerTitle: 'Spotify API Page'
    }} />
    
  </Stack>
  );
};

export default RootLayout