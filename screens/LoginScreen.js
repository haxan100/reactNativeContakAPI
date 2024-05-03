import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import API_BASE_URL from '../config/apiConfig';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const url = `${API_BASE_URL}auth/login`; // Menggunakan template string untuk menggabungkan URL dasar dengan endpoint spesifik
      console.log(url)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const json = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', json.token);  // Save the token to AsyncStorage
        navigation.navigate('Main'); // Navigate to Main tabs on success
      } else {
        throw new Error(json.message || 'Login failed');
      }
    } catch (error) {
      console.error('Failed to login', error.message);
      alert(error.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#666"  // Light gray color for placeholder
        />
        <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"  // Consistent placeholder color
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f4f4f4'
    },
    input: {
      width: '100%',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 15,
      borderRadius: 5,
      backgroundColor: '#fff',
      fontSize: 16,  // Increase font size for better readability
      color: '#333',  // Dark color for input text
      shadowColor: '#000',  // Shadow for depth
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3
    },
    button: {
      width: '100%',
      padding: 15,
      backgroundColor: '#0066ff',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 10
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333'
    }
  });
  
  export default LoginScreen;