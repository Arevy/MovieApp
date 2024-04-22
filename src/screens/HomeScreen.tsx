import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MovieCard} from '../components/MovieCard';
import {ThunkDispatch} from 'redux-thunk';
import {RootState} from '../store/configureStore';
import {Action} from 'redux';
import NetInfo from '@react-native-community/netinfo';
import {FETCH_MOVIES_SUCCESS, fetchMovies} from '../actions/movieActions';
import {
  checkConnection,
  loadMoviesFromStorage,
  saveMoviesToStorage,
} from '../utils/network';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'src/navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch<ThunkDispatch<RootState, void, Action>>();
  const {movies, loading, error, hasMore} = useSelector(
    (state: RootState) => state.movie,
  );
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Handling movie selection for navigation to details screen
  const handlePressMovie = (movieId: number) => {
    navigation.navigate('Details', {movieId});
  };

  // Handling addition to favorites
  const handleAddFavorite = (movieId: number) => {
    console.log('Added to favorites:', movieId);
    Alert.alert('Added to Favorites', `Movie ID: ${movieId}`);
  };

  // Trigger fetching more movies when the end of the list is reached
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      dispatch(fetchMovies(searchQuery, movies.length / 20 + 1)); // Assuming each page has 20 movies
    }
  };

  // Handling search initiation
  const handleSearch = () => {
    dispatch(fetchMovies(searchQuery, 1)); // Always search from the first page
  };

  useEffect(() => {
    if (!searchQuery) {
      // Load initial or refreshed movies only if not searching
      dispatch(fetchMovies('', 1)); // Load first page
    }
  }, [searchQuery, dispatch]);
  // Monitor internet connectivity and adjust UI accordingly
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      if (!state.isConnected) {
        Alert.alert('You are offline. Some features may not be available.');
      }
    });

    return () => unsubscribe();
  }, []);

  // Attempt to fetch movies depending on connectivity and search status
  useEffect(() => {
    const fetchMoviesIfNeeded = async () => {
      const isConnected = await checkConnection();
      if (!isConnected) {
        const savedMovies = await loadMoviesFromStorage();
        if (savedMovies.length > 0) {
          dispatch({
            type: FETCH_MOVIES_SUCCESS,
            payload: savedMovies,
            hasMore: false,
          });
        } else {
          Alert.alert('You are offline and no movie data is available.');
        }
      } else {
        dispatch(fetchMovies(searchQuery, 1));
      }
    };

    fetchMoviesIfNeeded();
  }, [dispatch, searchQuery]);

  // Save current movies to local storage for offline access
  useEffect(() => {
    if (movies.length > 0) {
      saveMoviesToStorage(movies);
    }
  }, [movies]);

  return (
    <View style={styles.container}>
      {isConnected ? null : <Text style={{color: 'red'}}>Offline Mode</Text>}
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} color="#0066cc" />
      {error ? (
        <Text style={styles.errorText}>Error fetching movies</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={({item}) => (
            <MovieCard
              movie={item}
              onPress={handlePressMovie}
              onFavoritePress={handleAddFavorite}
            />
          )}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
          }
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.5}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f8', // A light background color
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0, // Removing the border
    padding: 10,
    borderRadius: 20, // Rounded borders
    backgroundColor: '#fff', // White background for the input
    shadowColor: '#000', // Adding a shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'transparent', // Transparent button
    borderColor: '#0066cc',
    borderWidth: 1,
    borderRadius: 20, // Rounded borders for the button
    marginHorizontal: 100, // Side margins to narrow the button
    marginTop: 10, // Space above the button
  },
});

export default HomeScreen;
