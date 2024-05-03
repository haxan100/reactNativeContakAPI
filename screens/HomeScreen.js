import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
        {/* source={require('./logo.png')} */}

      <Image source={require('./logo.png')} style={styles.logo} />
      <Text style={styles.heading}>Welcome to Your Contact Management App</Text>
      <Text style={styles.description}>
        This application allows you to effectively manage your contacts. You can add, edit, and delete 
        contact details seamlessly. Navigate to the Contacts tab to view all your contacts or add new ones.
      </Text>
      <Text style={styles.description}>
        Visit the Profile tab to manage your account settings or to log out. This app is designed to make your 
        daily communications simpler and more efficient.
      </Text>
      {/* Optionally, you can add more sections below as per your app's features */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  }
});

export default HomeScreen;
