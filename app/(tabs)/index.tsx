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
  FlatList,
  Pressable,
} from "react-native";

import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";

//this is the ROOT route, the app will be loaded here first

//initializing database
async function initilizeDatabase(db: SQLiteAnyDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
      );
      `);
    console.log("Database initilised");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS fav_songs(
        song_id TEXT,
        user_id INTEGER,
        song_name TEXT,
        song_artist TEXT,
        song_image TEXT,
        PRIMARY KEY (song_id, user_id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
      `);
  } catch (error) {
    console.log("Error while initizaling database :", error);
  }
}

interface NewUser {
  username: string;
  password: string;
}

interface UserFormProps {
  addUser: (newUser: NewUser) => void;
  closeModal: () => void;
  logInUser: (username: string, password: string) => Promise<number | null>;
}

interface LoginFormProps {
  //closeModal: () => void;
  logInUser: (username: string, password: string) => Promise<number | null>;
  closeModal: () => void;
}

//userform component
const UserForm: React.FC<UserFormProps> = ({
  addUser,
  closeModal,
  logInUser,
}) => {
  const [user, setUser] = useState<NewUser>({ username: "", password: "" });

  const handleSave = () => {
    if (user.username.length == 0 || user.password.length == 0) {
      alert("Please fill in every field.");
    } else {
      addUser(user);
      alert("Account Created, you can now Sign In");
      closeModal();
      return;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#bfbfbf"
          style={styles.inputText}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
        />

        <View style={styles.lineSeprator}></View>

        <TextInput
          placeholder="Password"
          placeholderTextColor="#bfbfbf"
          style={styles.inputText}
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
        />
      </SafeAreaView>

      <Pressable onPress={handleSave} style={styles.modalButton}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>
    </>
  );
};

//loginForm component
const LoginForm: React.FC<LoginFormProps> = ({ logInUser, closeModal }) => {
  const [user, setUser] = useState<NewUser>({ username: "", password: "" });

  const handleLogin = async () => {
    console.log("in handle login");
    console.log("entered username: " + user.username);
    console.log("entered password: " + user.password);

    let id = await logInUser(user.username, user.password);

    console.log("id is ", id);
    if (id != null) {
      closeModal();
      router.push(`/home/${id}`);
    } else {
      alert("Invalid Credentials");
    }
  };
  return (
    <>
      <SafeAreaView style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#bfbfbf"
          style={styles.inputText}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
        />

        <View style={styles.lineSeprator}></View>

        <TextInput
          placeholder="Password"
          placeholderTextColor="#bfbfbf"
          style={styles.inputText}
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
        />
      </SafeAreaView>

      <Pressable onPress={handleLogin} style={styles.modalButton}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </>
  );
};

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

  const closeCreateAccountModal = () => {
    setIsCreateAccountModalVisible(false);
  };

  const closeSignInModal = () => {
    setIsSignInModalVisible(false);
  };

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

  return (
    <SQLiteProvider databaseName="example.db" onInit={initilizeDatabase}>
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

            <SignInContent closeSignInModal={closeSignInModal} />
          </SafeAreaView>
        </Modal>

        {/* create account modal to grab user info */}
        <Modal
          visible={isCreateAccountModalVisible}
          style={styles.modalBackground}
          animationType="slide"
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

            <UserContent closeCreateAccountModal={closeCreateAccountModal} />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SQLiteProvider>
  );
}

interface User {
  id: number;
  username: string;
  password: string;
}

interface Songs {
  song_id: string;
  user_id: number;
  song_name: string;
  song_artist: string;
  song_image: string;
}

interface NewUser {
  username: string;
  password: string;
}

interface UserContentProps {
  closeCreateAccountModal: () => void;
}

interface SignInContentProps {
  closeSignInModal: () => void;
}

const SignInContent: React.FC<SignInContentProps> = ({ closeSignInModal }) => {
  console.log("In signInContent");
  const db = useSQLiteContext(); //getting context of sql db
  const [users, setUsers] = useState<User[]>([]); //creating a user state of all users
  const [songs, setSongs] = useState<Songs[]>([]);

  console.log("Getting users... in sign in");
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

  const getSongs = async () => {
    try {
      const songRows = (await db.getAllAsync(
        "SELECT * FROM fav_songs"
      )) as Songs[];
      setSongs(songRows);
      console.log("Users song set: ", songRows);
    } catch (error) {
      console.log("Error while loading users : ", error);
    }
  };

  useEffect(() => {
    console.log("In useEffect for SIGN IN users db...");
    getUsers();
    getSongs();
  }, []);

  const logInUser = async (
    username: string,
    password: string
  ): Promise<number | null> => {
    console.log("in log in user function");
    console.log("passed in username ", username);
    console.log("passed in password ", password);
    try {
      // Query to select the user with the given username
      const result = await db.getAllAsync(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      // have to assert?
      const users = result as User[];

      console.log("list of users: ", users);

      // check if any user was found and verify the password
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          console.log("user id is ", user.id);
          return user.id; // return the id
        }
      }
      console.log("no user found");
      return null; // return null if credentials are invalid or no user found
    } catch (error) {
      console.log("Error while logging in user: ", error);
      return null;
    }
  };

  return (
    <View>
      <LoginForm logInUser={logInUser} closeModal={closeSignInModal} />
    </View>
  );
};

const UserContent: React.FC<UserContentProps> = ({
  closeCreateAccountModal,
}) => {
  console.log("In UserContent");

  const db = useSQLiteContext(); //getting context of sql db
  const [users, setUsers] = useState<User[]>([]); //creating a user state of all users

  console.log("Getting users... in UserContent");

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

  const logInUser = async (
    username: string,
    password: string
  ): Promise<number | null> => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      const users = result as User[];

      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          return user.id;
        }
      }
      return null;
    } catch (error) {
      console.log("Error while logging in user: ", error);
      return null;
    }
  };

  //function to add a user
  const addUser = async (newUser: NewUser) => {
    try {
      if (newUser.username.length == 0 || newUser.password.length == 0) {
        alert("Please enter all fields");
        return;
      }

      const existingUsers = (await db.getAllAsync(
        "SELECT username FROM users"
      )) as { username: string }[];
      const usernames = existingUsers.map((user) => user.username);

      if (usernames.includes(newUser.username)) {
        alert("Username is taken");
        return;
      }

      const statement = await db.prepareAsync(
        "INSERT INTO users (username, password) VALUES(?,?)"
      );
      await statement.executeAsync([newUser.username, newUser.password]);
      await getUsers();
    } catch (error) {
      console.log("Error while adding user : ", error);
    }
  };

  //get all users
  useEffect(() => {
    console.log("In useEffect for users db...");
    //addUser({ username: "dr c", password: "password" });
    getUsers();
  }, []);

  return (
    <View>
      <UserForm
        addUser={addUser}
        closeModal={closeCreateAccountModal}
        logInUser={logInUser}
      />
      {/* {users.length == 0 ? (
        <Text>No Users to load</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <Text>
              ID: {item.id} Username: {item.username} Password: {item.password}
            </Text>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )} */}
    </View>
  );
};

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
  input: {
    backgroundColor: "white",
  },
  userFormContainer: {
    padding: 20,
    backgroundColor: "#404040",
    borderRadius: 10,
    margin: 10,
  },
});
