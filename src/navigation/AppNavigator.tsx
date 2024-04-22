import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

// Type definitions for navigation parameters across the app
export type RootStackParamList = {
  Home: undefined; // No parameters expected for the Home screen
  Details: {movieId: number}; // Parameters for the Details screen include movieId
};

const Stack = createStackNavigator<RootStackParamList>();

// Main navigator component that manages transitions between screens
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
