import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useLocalSearchParams } from 'expo-router'

const Home = () => {

  const {user_id} = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>This is the Home Page</Text>
      <Text>User ID that was passed in: {user_id}</Text>
      <Link href={`/spotify/${user_id}`}>Click here for Spotify</Link>
      <Link href='/'>Go Back</Link>
    </SafeAreaView>
  )
}

export default Home