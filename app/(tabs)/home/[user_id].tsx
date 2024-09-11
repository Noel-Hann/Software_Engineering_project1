import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
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
      <Text>This is the Home Page</Text>
      <Text>User ID that was passed in: {user_id}</Text>
      <Link href={`/spotify/${user_id}`}>Click here for Spotify</Link>
      <Link href="/">Go Back</Link>
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
    backgroundColor: "white",
  },
});

export default Home;
