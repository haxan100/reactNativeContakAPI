import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/apiConfig';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setToken(userToken);
    };
    fetchToken();
  }, []);

  const addContact = async () => {
    try {
      const url = `${API_BASE_URL}contacts/addContact`; // Menggunakan template string untuk menggabungkan URL dasar dengan endpoint spesifik

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, email })
      });
      console.log("response=>>>>>",response)
      if (response.ok) {
        Alert.alert("Success", "Contact added successfully!");
        navigation.goBack(); // Go back to contact list after adding
      } else {
        throw new Error('Failed to add contact');
      }
    } catch (error) {
      console.error('APAAN ERORNYA =>>>>>>>>>>>>>>>>', error);
      Alert.alert("Error", "Failed to add contact");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#666"  // Light gray color for placeholder
        style={styles.input}
      />
      <Text style={styles.label}>Phone:</Text>
      <TextInput
        placeholder="Enter Phone"
        value={phone}
        
        onChangeText={setPhone}
        placeholderTextColor="#666"  // Light gray color for placeholder
        style={styles.input}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"  // Light gray color for placeholder
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={addContact}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
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
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default AddContactScreen;
