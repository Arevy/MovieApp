import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {loadMoviesFromStorage} from '../utils/network';
import {MovieCard} from '../components/MovieCard';
import {MovieInterface} from '../interfaces/MovieInterface';
import {RootStackParamList} from '../navigation/AppNavigator';

// Type for navigation props specific to this screen
type OfflineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Offline'
>;

const OfflineScreen = () => {
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const navigation = useNavigation<OfflineScreenNavigationProp>();

  useEffect(() => {
    const fetchMovies = async () => {
      const storedMovies = await loadMoviesFromStorage();
      if (storedMovies && Array.isArray(storedMovies)) {
        setMovies(storedMovies);
      }
    };

    fetchMovies();
  }, []);

  const handlePressMovie = (movieId: number) => {
    navigation.navigate('Details', {movieId});
  };

  // Optional: Function to handle adding to favorites
  const handleAddFavorite = (movieId: number) => {
    console.log('Added to favorites:', movieId);
    // Implement favorite logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Movies</Text>
      <FlatList
        data={movies}
        renderItem={({item}) => (
          <MovieCard
            movie={item}
            onPress={() => handlePressMovie(item.id)}
            onFavoritePress={() => handleAddFavorite(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OfflineScreen;
