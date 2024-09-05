import { View, Text, Button, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

const CLIENT_ID = "9f775d066d7c4ea3b25d5c58a42ce2f9";
const CLIENT_SECRET = "db8b9bd3f6644c78a1292403147dbfff";


const SpotifyComponent = () => {

    const [searchInput, setsearchInput] = useState("man in the mirror");
    const [accessToken, setAccessToken] = useState("");
    const [tracksInfo, setTracksInfo] = useState<Track[]>([]);
    

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

    interface Track {
        name: string;
        id: string;
        artist: string;
        image: string;
    }

    async function search() {
        console.log("Search for " + searchInput);


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

        let trackList: Track[] = [];
        for(let i = 0; i<tracks.length;i++){
            trackList.push({
                name: tracks[i].name,
                id: tracks[i].id,
                artist: tracks[i].artists[0].name,
                image : tracks[i].album.images[0].url
            });
        };

        setTracksInfo(trackList);
        //console.log("track list:" + trackList);

    }

  return (
    <View>
      <Text>SpotifyComponent</Text>
      <Button title="Search" onPress={() => search()} />
    

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

    </View>

  );
}

export default SpotifyComponent