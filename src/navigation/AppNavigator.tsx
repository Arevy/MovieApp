// src/navigation/AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import OfflineScreen from '../screens/OfflineScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: {movieId: number};
  Offline: undefined;
  Welcome: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen name="Home" component={HomeScreen}options={{title: 'Movies'}} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{title: 'Movie Details'}}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Welcome">
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      <Drawer.Screen name="Offline" component={OfflineScreen} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
