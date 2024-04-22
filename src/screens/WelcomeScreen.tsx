import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type WelcomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {rotateZ: `${rotation.value}deg`},
        {translateY: translateY.value},
      ],
      justifyContent: 'center', // Center content within the animated box
      alignItems: 'center', // Align items to the center
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(withSpring(360), -1, true);
    translateY.value = withRepeat(
      withSequence(
        withSpring(-30, {damping: 2, stiffness: 100}), // Moves up
        withSpring(30, {damping: 2, stiffness: 100}), // Moves down
      ),
      -1,
      true,
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Movie App</Text>
      <Animated.View style={[styles.box, animatedStyles]}>
        <Button
          title="Go to Movies"
          onPress={() => navigation.navigate('Movies')} // Updated to navigate to 'Movies' which is the stack navigator
          color="#FFFFFF" // Optional: Change button text color for visibility
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 50, // Provide space above the animated box
  },
  box: {
    width: 150, // Adjusted width for better button fit
    height: 150, // Adjusted height for better button fit
    backgroundColor: 'lime',
    justifyContent: 'center', // Ensure the button is centered inside the box
    alignItems: 'center', // Align items to the center
  },
});

export default WelcomeScreen;
