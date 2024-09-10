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

//this is the spotify page, this is where users will be able to seach and favorite songs

//api id and seceret
const CLIENT_ID = "9f775d066d7c4ea3b25d5c58a42ce2f9";
const CLIENT_SECRET = "db8b9bd3f6644c78a1292403147dbfff";

// Get screen width so it can the cards' width an be dynamically set
const screenWidth = Dimensions.get("window").width;
const numColumns = 2; // Number of columns to fit in each row
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * (numColumns + 1)) / numColumns; // Dynamic card width formula

const SpotifyComponent = () => {
  //useStates for getting input, acess token, and the info about the tracks that were searched
  const [searchInput, setsearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tracksInfo, setTracksInfo] = useState<Track[]>([]);

  const [searchTriggered, setSearchTriggered] = useState(false);

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

  //had to do this weird interface thing for typescript and make an interface
  interface Track {
    name: string;
    id: string;
    artist: string;
    image: string;
  }

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

  const { user_id } = useLocalSearchParams(); //to get the passed in user id

  return (
    <SafeAreaView style={styles.container}>
      <Link href={`/home/${user_id}`} style={styles.modalTextTitle}>
        Back
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
        numColumns={numColumns} // Display 2 cards per row
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <SafeAreaView>
            <View style={[styles.card, { width: cardWidth }]}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDetails}>{item.artist}</Text>
                {/* <Text>Song ID: {item.id}</Text> */}
              </View>
            </View>
          </SafeAreaView>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#202020",
    paddingTop: 20,
  },
  card: {
    //width: 200,
    //height: 300,
    borderWidth: 1,
    //borderColor: "#444444",
    borderRadius: 25,
    //shadowColor: "black",
    //shadowOffset: { width: 5, height: 5 },
    //shadowOpacity: 0.8,
    //shadowRadius: 5,
    marginBottom: 10,
    margin: 10,
    marginHorizontal: cardMargin / 2,
    maxWidth: 200,
    height: "auto",
    overflow: "hidden",
    backgroundColor: "black",
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    right: 5,
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  cardDetails: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
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
});

export default SpotifyComponent;
