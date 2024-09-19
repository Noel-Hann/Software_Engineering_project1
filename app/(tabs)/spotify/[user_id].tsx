import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";

//this is the spotify page, this is where users will be able to seach and favorite songs

//api id and seceret
const CLIENT_ID = "9f775d066d7c4ea3b25d5c58a42ce2f9";
const CLIENT_SECRET = "db8b9bd3f6644c78a1292403147dbfff";

//useing Dimensions library to scale sizes to different devices
const { width, height } = Dimensions.get("window"); //width of the screen
const SCALE_FONT = (size: number) => (width / 375) * size; //scaling the font

const SpotifyComponent = () => {
  //useStates for getting input, acess token, and the info about the tracks that were searched
  const [searchInput, setsearchInput] = useState(""); //sets and keeps track of the user search input when searching for a song
  const [accessToken, setAccessToken] = useState(""); //sets and keeps track of the acess token given by spotify api
  const [tracksInfo, setTracksInfo] = useState<Track[]>([]); //sets and keeps track of all the tracks recieved from the api
  const [searchTriggered, setSearchTriggered] = useState(false); //sets and keeps track when a search is triggered

  //intefaces for typescript
  //User object defined
  interface User {
    id: number;
    username: string;
    password: string;
  }
  //track object defined
  interface Track {
    name: string;
    id: string;
    artist: string;
    image: string;
  }
  //favorited song object defined
  interface favSongObject {
    song_id: string;
    user_id: number;
    song_name: string;
    song_artist: string;
    song_image: string;
  }

  const db = useSQLiteContext(); //getting context of sql db
  const [users, setUsers] = useState<User[]>([]); //creating a user state of all users
  const [currentSong, setCurrentSong] = useState<favSongObject>();

  //useEffect first function called in react native
  useEffect(() => {
    console.log("In useEffect for SPOTIFY ROUTE users db...");
    getUsers(); //getting the database of users
    //getSongs(); //getting the database of songs
  }, []);

  const getUsers = async () => {
    try {
      const userRows = (await db.getAllAsync("SELECT * FROM users")) as User[]; //get all users querey
      setUsers(userRows); //set user state with the database of users
      console.log("Users row set: ", userRows);
    } catch (error) {
      console.log("Error while loading users : ", error);
    }
  };

  //adds favorite song to a user
  const addFavSong = async (songDetails: favSongObject) => {
    console.log("in addFavSong, songDetails is: ", songDetails);
    if (!songDetails) {
      //if song is null, return
      console.log("No song selected to add to favorites.");
      return;
    }

    console.log("checking if user already favorited...");

    //check is this user already favorited this song
    const checkIfFavoritedByUserSatement = await db.getAllAsync(
      `SELECT * FROM fav_songs WHERE user_id = ? AND song_id = ?`,
      [songDetails.user_id, songDetails.song_id]
    );

    console.log("result of check STATEMENT: ", checkIfFavoritedByUserSatement);

    //if the result has more than 0 objetcs, the user already favoried, so just return
    if (checkIfFavoritedByUserSatement.length > 0) {
      alert("You already favorited this song");
      return;
    }

    //put the favotite song into the database for the user
    const statement = await db.prepareAsync(
      `INSERT INTO fav_songs (song_id, user_id, song_name, song_artist, song_image)  
      VALUES(?,?,?,?,?)`
    );
    console.log("preparing to add song");
    await statement.executeAsync([
      songDetails.song_id,
      songDetails.user_id,
      songDetails.song_name,
      songDetails.song_artist,
      songDetails.song_image,
    ]);
    alert(
      songDetails.song_name + " by " + songDetails.song_artist + " favorited"
    );
    console.log("song added?");
    getFavSongs();
    try {
    } catch (error) {
      console.log("Error while trying to add a favorite song : ", error);
    }
  };

  //get the database of all favorited songs
  const getFavSongs = async () => {
    console.log("getting all fav songs");
    try {
      const songRows = (await db.getAllAsync(
        "SELECT * FROM fav_songs"
      )) as favSongObject[];
      console.log("all favorited songs by al users: ", songRows);
    } catch (error) {
      console.log("Error while loading all songs : ", error);
    }
  };

  //this useEffect will get us an acess token for the spotify api
  useEffect(() => {
    var authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.error("Error fetching token:", error));

    console.log(accessToken);
  }, []);

  //search function that will actually search for songs in the api
  async function search() {
    console.log("Search for " + searchInput);
    if (!searchInput) {
      setSearchTriggered(false);
      return;
    }

    var trackParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    const response = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=track",
      trackParams
    );
    const data = await response.json();
    const tracks = data.tracks.items;
    console.log(tracks[0].album.images[0].url);

    //going through the data recieved from the api and pushing in into an array
    let trackList: Track[] = [];
    for (let i = 0; i < tracks.length; i++) {
      trackList.push({
        name: tracks[i].name,
        id: tracks[i].id,
        artist: tracks[i].artists[0].name,
        image: tracks[i].album.images[0].url,
      });
    }

    setTracksInfo(trackList); //using the useState at the top of the class to update it with the array of data we just got
    //console.log("track list:" + trackList);
    setSearchTriggered(true);
  }

  const logSongDetails = (track: Track) => {
    console.log("Song ID:", track.id);
    console.log("Song Name:", track.name);
    console.log("Artist:", track.artist);
    console.log("Image URL:", track.image);
    console.log("User ID:", user_id);

    const songDetails = {
      song_id: track.id,
      user_id: Number(user_id), // Ensure user_id is a number
      song_name: track.name,
      song_artist: track.artist,
      song_image: track.image,
    };

    console.log("in log details songDetails is: ", songDetails);

    addFavSong(songDetails);
  };

  const isFavorited = async (songID: string) => {
    try {
      const userID = Number(user_id);
      const rows = await db.getAllAsync(
        "SELECT * FROM fav_songs WHERE user_id = ? AND song_id = ?",
        [userID, songID]
      );
      //setUsers(userRows);
      console.log("checking for favorited song set set: ", rows);
      if (rows.length > 0) {
        console.log("this song is favorited");
        return true;
      } else {
        console.log("this song is NOT favorited");
        return false;
      }
    } catch (error) {
      console.log(
        "There was an error checking to see if a song was favorited: ",
        error
      );
      return false;
    }
  };

  const favoritedImages = {
    favorited: require("../images/heart_FAVORITED.png"),
    unfavorited: require("../images/heart_UNFAVORITED.png"),
  };

  const getFavoritedImage = async (id: string) => {
    const isFavSong = await isFavorited(id);
    switch (isFavSong) {
      case true:
        return favoritedImages.favorited;
      default:
        return favoritedImages.unfavorited;
    }
  };

  const { user_id } = useLocalSearchParams(); //to get the passed in user id

  return (
    <SafeAreaView style={styles.container}>
      <Link href={`/home/${user_id}`} style={styles.modalTextTitle}>
        Back
      </Link>
      <Link href={`/favorites/${user_id}`} style={styles.favText}>
          Favorites
        </Link>

      <View style={styles.flex}>
        <TextInput
          placeholder="Search for a song"
          placeholderTextColor="white"
          style={styles.search}
          value={searchInput}
          onChangeText={setsearchInput} // Update the searchInput state
        />

        <Pressable onPress={search}>
          <Image
            source={require("../images/search.png")}
            style={{ width: 30, height: 30 }}
          ></Image>
        </Pressable>
      </View>

      {searchTriggered ? (
        <Text style={styles.searchText}>Results for {searchInput}</Text>
      ) : null}

      <FlatList
        data={tracksInfo}
        keyExtractor={(item) => item.id}
        numColumns={2} //only displaying 2 columns for the cards
        columnWrapperStyle={styles.cardContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardDetails}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardArtist}>{item.artist}</Text>
              {/* <Text>Song ID: {item.id}</Text> */}

              <Pressable
                //style={styles.favButton}
                onPress={() => logSongDetails(item)}
              >
                <Text style={styles.favButtonText}>❤️</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "center",
    backgroundColor: "#202020",
    //paddingTop: 20,
  },
  card: {
    backgroundColor: "black",
    borderRadius: 10,
    width: width * 0.4,
    alignSelf: "center",
    marginHorizontal: width * 0.02,
    overflow: "hidden",
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    //right: 5,
  },
  cardImage: {
    width: "100%",
    height: height * 0.15,
  },
  cardDetails: {
    margin: width * 0.04,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
  },
  search: {
    backgroundColor: "#404040",
    borderRadius: 25,
    width: 300,
    color: "white",
    height: 40,
    margin: 10,
    paddingLeft: 20,
  },
  text: {
    color: "white",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 15,
  },
  modalTextTitle: {
    color: "white",
    fontSize: 20,
    margin: 0,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  searchText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  cardArtist: {
    color: "white",
  },
  cardContainer: {
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  favoritedHeartImage: {
    width: width * 0.2,
    height: height * 0.03,
    resizeMode: "contain",
    marginTop: height * 0.01,
  },
  favButton: {
    width: width * 0.3,
    height: height * 0.06,
    backgroundColor: "#1DB954",
    borderRadius: 25,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "5%",
  },
  favButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: SCALE_FONT(20),
  },

  favText: {
    color: "white",
    fontSize: 20,
    margin: 0,
    paddingBottom: 10,
    fontWeight: "bold", 
    alignItems: "center",
    textAlign: "right",
  },
});

export default SpotifyComponent;
