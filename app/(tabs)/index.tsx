import { Image, StyleSheet, Platform, Text, Button, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SpotifyAPI from '@/app/(tabs)/spotify/[user_id]';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './Login'; 
import { useState } from 'react';
import { useRouter } from 'expo-router';




//this is the ROOT route, the app will be loaded here first

export default function HomeScreen() {

  const [userNameInput, setUserNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  let user_test_id = 99; //user id for tesing

  //to verify username and password
  const verifyLogIn = () => {
    console.log("Username Entered = " + userNameInput);
    console.log("Password Entered = " + passwordInput);

    // will pull info from databse and verify
    // once database is implemented

      if(userNameInput == 'test' && passwordInput == 'test'){
        router.push(`/home/${user_test_id}`);
       
      } else {

        alert('Invalid Credentials');

      }
  }

  return (
    <SafeAreaView style={styles.container}>

        <Text>This is the Log In Screen....</Text>

        <Link href={`/home/${user_test_id}`}>Click here for Home Screen</Link>

        <Login 
          placeholder='Username' 
          secureTextEntry={false}
          value={userNameInput}
          onChangeText={text => setUserNameInput(text)} />

        <Login 
          placeholder='Password' 
          secureTextEntry={true}
          value = {passwordInput}
          onChangeText={text => setPasswordInput(text)}/>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={verifyLogIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle2}
        onPress={verifyLogIn}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: '#1DB954', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  buttonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonStyle2: {
    backgroundColor: 'black', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
});



  

