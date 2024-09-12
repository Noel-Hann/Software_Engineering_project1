import {
  Image,
  StyleSheet,
  Platform,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  TextInputBase,
  TextInputComponent,
  TextInput,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SpotifyAPI from "@/app/(tabs)/spotify/[user_id]";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "./Login";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

//this is the ROOT route, the app will be loaded here first

export default function HomeScreen() {
  //setting username and password inputs to an empty string
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [newUserNameInput, setNewUserNameInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newConfirmPasswordInput, setNewConfirmPasswordInput] = useState("");

  //making modals not visible when the app is loaded
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] =
    useState(false);

  let user_test_id = 99; //user id for tesing

  //to verify username and password
  const verifyLogIn = () => {
    console.log("Username Entered = " + userNameInput);
    console.log("Password Entered = " + passwordInput);

    // will pull info from databse and verify
    // once database is implemented
    //for now just test if they both username and pass equal "test"

    if (userNameInput == "test" && passwordInput == "test") {
      setIsSignInModalVisible(false);
      setUserNameInput("");
      setPasswordInput("");
      router.push(`/home/${user_test_id}`);
    } else {
      alert("Invalid Credentials");
    }
  };

  //verifying a new account
  //NOTE: database is not implemnted so no account is actually being made right now
  //it will just test if the password and confirmed password match
  const verifyNewAccount = () => {
    console.log("Username Entered = " + newUserNameInput);
    console.log("Password Entered = " + newPasswordInput);
    console.log("New Password Entered = " + newConfirmPasswordInput);

    //add logic from database to see if username is taken
    //if not, and passwords match, create the account and grab the new ID

    if (newPasswordInput == newConfirmPasswordInput) {
      setNewUserNameInput("");
      setNewPasswordInput("");
      setNewConfirmPasswordInput("");
      setIsCreateAccountModalVisible(false);
      router.push(`/home/${user_test_id}`);
    } else {
      alert("Username is taken or Passwords don't match");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("./images/spotify-api-BLACK.png")}
          style={{ width: 400, height: 300 }}
        ></Image>
      </View>

      <SafeAreaView style={styles.bottomContainer}>
        <Text style={styles.titleText}>Welcome</Text>

        {/* this touchable opens the sign in modal */}
        <TouchableOpacity
          style={styles.buttonStyle2}
          onPress={() => setIsSignInModalVisible(true)}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* this touchable opens the create account modal */}
        <TouchableOpacity
          style={styles.buttonStyle2}
          onPress={() => setIsCreateAccountModalVisible(true)}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* sign in modal to grab entered info */}
      <Modal
        visible={isSignInModalVisible}
        style={styles.modalBackground}
        animationType="slide"
        // presentationStyle="pageSheet"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.horzFlex}>
            <TouchableOpacity onPress={() => setIsSignInModalVisible(false)}>
              <Text style={styles.modalTextTitle}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.signInText}>Sign In</Text>
          </View>

          <View style={styles.lineSeprator}></View>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={userNameInput}
              onChangeText={(text) => setUserNameInput(text)}
            ></TextInput>
            <View style={styles.lineSeprator}></View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={passwordInput}
              onChangeText={(text) => setPasswordInput(text)}
              secureTextEntry={true}
            ></TextInput>
          </SafeAreaView>

          <TouchableOpacity style={styles.modalButton} onPress={verifyLogIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* create account modal to grab user info */}
      <Modal
        visible={isCreateAccountModalVisible}
        style={styles.modalBackground}
        animationType="slide"
        // presentationStyle="pageSheet"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.horzFlex}>
            <TouchableOpacity
              onPress={() => setIsCreateAccountModalVisible(false)}
            >
              <Text style={styles.modalTextTitle}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.signInText}>Create Account</Text>
          </View>

          <View style={styles.lineSeprator}></View>

          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={newUserNameInput}
              onChangeText={(text) => setNewUserNameInput(text)}
            ></TextInput>
            <View style={styles.lineSeprator}></View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={newPasswordInput}
              onChangeText={(text) => setNewPasswordInput(text)}
              secureTextEntry={true}
            ></TextInput>
            <View style={styles.lineSeprator}></View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#bfbfbf"
              style={styles.inputText}
              value={newConfirmPasswordInput}
              onChangeText={(text) => setNewConfirmPasswordInput(text)}
              secureTextEntry={true}
            ></TextInput>
          </SafeAreaView>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={verifyNewAccount}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  modalBackground: {
    backgroundColor: "gray",
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
  bottomContainer: {
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    bottom: 0,
    position: "absolute",
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
  },
  buttonStyle: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonStyle2: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 75,
  },
  titleText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    margin: 0,
    paddingBottom: 10,
  },
  modalTextTitle: {
    color: "white",
    fontSize: 20,
    margin: 0,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  inputContainer: {
    width: 300,
    backgroundColor: "#404040",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    // alignItems: "flex-start",
    justifyContent: "center",
    textAlign: "center",
  },
  lineSeprator: {
    height: 3,
    backgroundColor: "#505050",
    marginVertical: 10,
  },
  inputText: {
    color: "white",
  },
  horzFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 15,
  },
  signInText: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    margin: 0,
    paddingBottom: 10,
    right: 25,
  },
  modalButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 60,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    bottom: 80,
  },
});
