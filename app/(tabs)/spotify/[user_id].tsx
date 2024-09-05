import { View, Text, Button, FlatList, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';

//this is the spotify page, this is where users will be able to seach and favorite songs

const CLIENT_ID = "9f775d066d7c4ea3b25d5c58a42ce2f9";
const CLIENT_SECRET = "db8b9bd3f6644c78a1292403147dbfff";


const SpotifyComponent = () => {


    //useStates for getting input, acess token, and the info about the tracks that were searched
    const [searchInput, setsearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [tracksInfo, setTracksInfo] = useState<Track[]>([]);
    
    //this useEffect will get us an acess token for the spotify api
    useEffect(() => {

        var authParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token', authParams)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))
            .catch(error => console.error("Error fetching token:", error));

            console.log(accessToken);

            
    }, []);

    //had to do this weird interface thing for typescript
    interface Track {
        name: string;
        id: string;
        artist: string;
        image: string;
    }


    //search function that will actually search for songs in the api
    async function search() {
        console.log("Search for " + searchInput);
        if (!searchInput) return;


        var trackParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        const response = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', trackParams);
        const data = await response.json();
        const tracks = data.tracks.items;
        console.log(tracks[0].album.images[0].url);


        //going through the data recieved from the api and pushing in into an array
        let trackList: Track[] = [];
        for(let i = 0; i<tracks.length;i++){
            trackList.push({
                name: tracks[i].name,
                id: tracks[i].id,
                artist: tracks[i].artists[0].name,
                image : tracks[i].album.images[0].url
            });
        };

        setTracksInfo(trackList); //using the useState at the top of the class to update it with the array of data we just got
        //console.log("track list:" + trackList);

    }

    const {user_id} = useLocalSearchParams(); //to get the passed in user id

  return (
    <SafeAreaView>
      <Text>This is the Spotify API</Text>
      <Link href='/'>Go Back</Link>
      <Text>User ID that was passed in: {user_id}</Text>
      

      <TextInput
        placeholder="Search for a song"
        value={searchInput}
        onChangeText={setsearchInput} // Update the searchInput state
      />

       <Button title="Search" onPress={search} />

        <FlatList

        data = {tracksInfo}
        keyExtractor={item => item.id}
        renderItem={({item})=>

            <View style={{margin:0, padding:10}}>

                <Text>Song Name: {item.name}</Text>
                <Text>Artist: {item.artist}</Text>
                <Text>Song ID: {item.id}</Text>
                <Image 
                    src={item.image} 
                    style = {{width: 200, height: 200}}
                    />
            

            </View>

            

        }
        />

    </SafeAreaView>

  );
}

export default SpotifyComponent