import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { withLayoutContext } from 'expo-router'


//interface for to recognize prop types gor typescript
interface Props{
    placeholder: string;
    secureTextEntry: boolean;
    value: string;
    onChangeText: (text: string) => void;
    
}

const Login: React.FC<Props>=({placeholder, secureTextEntry, value, onChangeText}) => {
  return (

    <View style={styles.container}>
      <TextInput
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        width: '75%',

        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{},
})

export default Login