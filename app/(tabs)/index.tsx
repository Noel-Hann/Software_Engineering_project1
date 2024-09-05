import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SpotifyAPI from '@/app/(tabs)/spotify/[user_id]';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

//this is the ROOT route, the app will be loaded here first

export default function HomeScreen() {

  let user_test_id = 99; //user id for tesing

  return (
    <SafeAreaView>

        <Text>This is the Log In Screen</Text>

        <Link href={`/home/${user_test_id}`}>Click here for Home Screen</Link>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
