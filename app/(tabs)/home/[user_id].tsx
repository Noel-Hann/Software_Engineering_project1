import { View, Text, StyleSheet, Image } from "react-native";
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
      <SafeAreaView style={styles.bottomContainer}>
        <SafeAreaView style={styles.headingContainer}>
          <Text style={styles.homeTitle}>Home Page</Text>
          <Text style={styles.buttonText}>User ID: {user_id}</Text>
        </SafeAreaView>

        <Link href={`/spotify/${user_id}`} style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>Search</Text>
        </Link>
        <Link href={`/favorites/${user_id}`} style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>My Favorites</Text>
        </Link>
        <Link href="/" style={styles.buttonStyle2}>
          <Text style={styles.buttonText}>Back</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    alignItems: "center",
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
    marginTop: "15%",
    marginBottom: "15%",
    flex: 1,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  homeTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  imageContainer: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    bottom: 80,
  },
});

export default Home;
