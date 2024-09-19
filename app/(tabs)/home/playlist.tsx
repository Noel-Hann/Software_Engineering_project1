// import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Link, useLocalSearchParams } from 'expo-router';

// // Sample data for playlist items
// const samplePlaylist = [
//   { id: '1', name: 'Song 1', artist: 'Artist 1' },
//   { id: '2', name: 'Song 2', artist: 'Artist 2' },
//   { id: '3', name: 'Song 3', artist: 'Artist 3' },
// ];

// const playlist = () => {
//   const { user_id } = useLocalSearchParams(); 

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Playlist Page</Text>
//       <Text>User ID: {user_id}</Text>

//       <FlatList
//         data={samplePlaylist}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.item}>
//             <Text>{item.name}</Text>
//             <Text>{item.artist}</Text>
//           </View>
//         )}
//       />

//       <Link href={`/spotify/${user_id}`} style={styles.link}>
//         <Text>Go to Spotify Page</Text>
//       </Link>
//       <Link href='/'>
//         <Text>Go Back</Text>
//       </Link>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   item: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   link: {
//     marginTop: 20,
//     color: 'blue',
//   },
// });

// export default playlist;