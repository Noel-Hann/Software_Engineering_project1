import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { SLOPE_FACTOR } from "react-native-reanimated/lib/typescript/reanimated2/animation/decay/utils";
import { useSQLiteContext } from "expo-sqlite";

interface User {
  id: number;
  username: string;
  password: string;
}

const Home = () => {
  const { user_id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>

      <SafeAreaView style={styles.spotifyImageContainer}>
        <Image
          source={require("../images/spotify-api-WHITE.png")}
          style={styles.spotifyImage}
        ></Image>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomContainer}>
        <Text style={styles.titleText}>Home Page</Text>
        {/* <Text style={styles.titleText}>User ID: {user_id}</Text> */}

        <Link href={`/spotify/${user_id}`} style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>
            Search
            <Image
              source={require("../images/search-icon-png-9993.png")}
              style={{ width: 30, height: 30, backgroundColor: "transparent" }}
            ></Image>
          </Text>
        </Link>
        <Link href={`/favorites/${user_id}`} style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>
            My Favorites
            <Image
              source={require("../images/white-star-icon-13227.png")}
              style={{ width: 30, height: 30, backgroundColor: "transparent" }}
            ></Image>
          </Text>
        </Link>
        <Link href="/" style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>Log Out</Text>
        </Link>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const db = async () => {
  console.log("is db in home screen");
  const db = useSQLiteContext(); //getting context of sql db
  const [users, setUsers] = useState<User[]>([]); //creating a user state of all users

  console.log("Getting users... in home screen");
  //function to get all users
  const getUsers = async () => {
    try {
      const userRows = (await db.getAllAsync("SELECT * FROM users")) as User[];
      setUsers(userRows);
      console.log("Users row set: ", userRows);
    } catch (error) {
      console.log("Error while loading users : ", error);
    }
  };

  useEffect(() => {
    console.log("In useEffect for SIGN IN users db...");
    getUsers();
  }, []);
};

//useing Dimensions library to scale sizes to different devices
const { width, height } = Dimensions.get("window"); //width of the screen
const SCALE_FONT = (size: number) => (width / 375) * size; //scaling the font

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1DB954",
    alignItems: "center",
    height: "100%",
  },
  spotifyImageContainer: {
    //backgroundColor: "black",
    width: "80%",
    height: "50%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    margin: width * 0.05,
  },
  spotifyImage: {
    width: "100%",
    height: "100%",
  },

  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: "#303030",
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },

  headingContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    textAlign: "center",
  },

  bottomContainer: {
    left: "0%",
    right: "0%",
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    bottom: "0%",
    position: "absolute",
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
  },

  buttonStyle2: {
    backgroundColor: "#1DB954",
    paddingVertical: 20,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 35,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 75,
  },

  buttonText: {
    color: "white",
    fontSize: SCALE_FONT(24),
    fontWeight: "bold",
  },
  homeTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  titleText: {
    color: "white",
    fontSize: SCALE_FONT(28),
    fontWeight: "bold",
    //margin: 0,
    paddingBottom: "2%",
  },
});

export default Home;
