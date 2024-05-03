import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const rotation = useRef(new Animated.Value(0)).current; // Animated value for rotation

  useEffect(() => {
    checkLogin();
    animateLogo();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setTimeout(() => {
      if (token) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, 2900);
  };

  const animateLogo = () => {
    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'] // Rotation from 0 to 360 degrees
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./logo.png')}
        style={[styles.logo, { transform: [{ rotate: rotationInterpolate }] }]}
      />
      <Text style={styles.text}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50, // Half of width/height to make it round
  },
  text: {
    fontSize: 20,
    color: '#fff',
  }
});

export default SplashScreen;
