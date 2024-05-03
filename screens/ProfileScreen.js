import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    username: 'Loading...',
    email: 'loading@example.com' // Default values while loading
  });

  useEffect(() => {
    // Here, we would fetch user info from a server or local storage
    const loadUserInfo = async () => {
      const username = await AsyncStorage.getItem('username'); // Stored at login/registration
      const email = await AsyncStorage.getItem('email'); // Stored at login/registration

      if (username && email) {
        setUserInfo({ username, email });
      }
    };

    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    // Clear AsyncStorage and navigate to the Login Screen
    await AsyncStorage.clear(); // This clears all app-related data stored in AsyncStorage
    navigation.replace('Login'); // Ensures user cannot navigate back to Profile screen after logging out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Profile</Text>
      <Text style={styles.info}>Username: {userInfo.username}</Text>
      <Text style={styles.info}>Email: {userInfo.email}</Text>
      <Button
        title="Logout"
        color="#dc3545"
        onPress={() => Alert.alert(
          'Logout',
          'Are you sure you want to log out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: handleLogout }
          ],
          { cancelable: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  }
});

export default ProfileScreen;
