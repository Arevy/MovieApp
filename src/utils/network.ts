import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MovieInterface} from '../interfaces/MovieInterface';

// Salvarea filmelor în AsyncStorage
export const saveMoviesToStorage = async (movies: MovieInterface[]) => {
  try {
    const jsonMovies = JSON.stringify(movies);
    await AsyncStorage.setItem('savedMovies', jsonMovies);
    console.log('Movies saved:', jsonMovies);
  } catch (e) {
    console.error('Failed to save movies:', e);
  }
};

// Load movies from AsyncStorage
export const loadMoviesFromStorage = async (): Promise<MovieInterface[]> => {
  try {
    const jsonMovies = await AsyncStorage.getItem('savedMovies');
    const movies = jsonMovies != null ? JSON.parse(jsonMovies) : [];
    console.log('Loaded movies:', movies);
    return movies;
  } catch (e) {
    console.error('Failed to load movies:', e);
    return [];
  }
};

export const checkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
