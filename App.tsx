import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoginScreen from './screens/LoginScreen';
import ContactListScreen from './screens/ContactListScreen';
import AddContactScreen from './screens/AddContactScreen';
import EditContactScreen from './screens/EditContactScreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';  // Pastikan file ini ada dan benar
import ProfileScreen from './screens/ProfileScreen';  // Pastikan file ini ada dan benar
import RegisterScreen from './screens/RegisterScreen';  // Pastikan file ini ada dan benar
import ImportExcelScreen from './screens/ImportExcelScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'book' : 'book';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
          }else if (route.name === 'Import') {
            iconName = focused ? 'upload' : 'upload';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Contacts" component={ContactListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Import" component={ImportExcelScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="AddContact" component={AddContactScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
