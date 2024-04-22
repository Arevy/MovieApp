import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvarea filmelor în AsyncStorage
export const saveMoviesToStorage = async (movies: any) => {
  try {
    const jsonMovies = JSON.stringify(movies);
    await AsyncStorage.setItem('savedMovies', jsonMovies);
  } catch (e) {
    console.error('Failed to save movies: ', e);
  }
};

// Încărcarea filmelor din AsyncStorage
export const loadMoviesFromStorage = async () => {
  try {
    const jsonMovies = await AsyncStorage.getItem('savedMovies');
    return jsonMovies != null ? JSON.parse(jsonMovies) : [];
  } catch (e) {
    console.error('Failed to load movies: ', e);
    return [];
  }
};

export const checkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
