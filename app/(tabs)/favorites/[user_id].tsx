import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  Button,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

const Favorites = () => {
  const { user_id } = useLocalSearchParams(); //grabs the id of the user that is pased in
  const db = useSQLiteContext(); //getting context of sqlite database

  const [songs, setSongs] = useState<Songs[]>([]); //state of the list of favorited songs
  //typescript wants Songs object defined
  interface Songs {
    song_id: string;
    user_id: number;
    song_name: string;
    song_artist: string;
    song_image: string;
  }

  //useEffect is called when screen is rendered, so we will get the songs immediately
  useEffect(() => {
    getSongs();
  }, []);

  //method to grab all the user's favorited songs
  const getSongs = async () => {
    try {
      console.log("in get songs in favorites page");
      console.log("user_id is: ", user_id);

      const id = Array.isArray(user_id) ? user_id[0] : user_id; //typescript wants to make sure user_id is an int
      console.log("id is: ", id);

      //query to get favoirted songs
      const songRows = (await db.getAllAsync(
        "SELECT * FROM fav_songs WHERE user_id = ?",
        [id]
      )) as Songs[];
      setSongs(songRows); //setting state of songs that were favorited by this user
      console.log("In FAVORITES, Users songs from this user are: ", songRows);
    } catch (error) {
      console.log("Error while loading a user's songs: ", error);
    }
  };

  //remove a song from user's favorites
  const removeSong = async (user_id: number, song_id: string) => {
    try {
      console.log("in removeSongs");
      console.log("user_id is: ", user_id);
      console.log("song_id: ", song_id);

      const statement = await db.prepareAsync(
        "DELETE FROM fav_songs WHERE user_id = ? AND song_id = ?"
      );
      await statement.executeAsync([user_id, song_id]);
      console.log("song removed?");
      getSongs();
      console.log(songs);
    } catch (error) {
      console.log("There was an error removing the song: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRowContainter}>
        <Link href={`/home/${user_id}`} style={styles.backText}>
          Back
        </Link>
        <Text style={styles.titleText}>Favorites</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </View>
      {songs.length == 0 ? (
        <Text>No Favorited Songs</Text>
      ) : (
        <FlatList //flatlist to display favorited (loop that renders like a recycler view)
          data={songs}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.song_image }}
                style={styles.cardImage}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{item.song_name}</Text>
                <Text style={styles.cardArtist}>{item.song_artist}</Text>
                {/* <Button
                  title="Remove"
                  onPress={() => {
                    removeSong(item.user_id, item.song_id);
                  }}
                /> */}
                <Pressable
                  onPress={() => {
                    removeSong(item.user_id, item.song_id);
                  }}
                >
                  {/* <Image
                    style={styles.favoritedHeartImage}
                    source={require("../images/heart_FAVORITED.png")}
                  ></Image> */}
                  <Text style={styles.unfavoriteTextEmoji}>💔</Text>
                </Pressable>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.song_id.toString()}
          numColumns={2} //only displaying 2 columns for the cards
          columnWrapperStyle={styles.cardContainer}
        />
      )}
    </SafeAreaView>
  );
};

//useing Dimensions library to scale sizes to different devices
const { width, height } = Dimensions.get("window"); //width of the screen
const SCALE_FONT = (size: number) => (width / 375) * size; //scaling the font

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "15%",
    paddingHorizontal: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202020",
  },
  topRowContainter: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.05,
  },
  topRowText: {
    color: "white",
    fontSize: SCALE_FONT(20),
    fontWeight: "bold",
  },
  backText: {
    color: "white",
    fontSize: SCALE_FONT(15),
    fontWeight: "semibold",
    flex: 1,
    textAlign: "left",
  },
  titleText: {
    color: "white",
    fontSize: SCALE_FONT(20),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  logoutText: {
    color: "white",
    fontSize: SCALE_FONT(15),
    fontWeight: "semibold",
    flex: 1,
    textAlign: "right",
  },
  cardContainer: {
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  card: {
    backgroundColor: "black",
    borderRadius: 10,
    width: width * 0.4,
    alignSelf: "center",
    marginHorizontal: width * 0.02,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: height * 0.15,
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
  },
  cardArtist: {
    color: "white",
  },
  cardDetails: {
    margin: width * 0.04,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  favoritedHeartImage: {
    width: width * 0.2,
    height: height * 0.03,
    resizeMode: "contain",
    marginTop: height * 0.01,
  },
  unfavoriteTextEmoji: {
    color: "white",
    fontWeight: "bold",
    fontSize: SCALE_FONT(20),
  },
});

export default Favorites;
