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

  const handlePressMovie = (movieId: number) => {
    navigation.navigate('Details', {movieId});
  };

  const handleAddFavorite = (movieId: number) => {
    console.log('Added to favorites:', movieId);
    Alert.alert('Added to Favorites', `Movie ID: ${movieId}`);
  };

  
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      dispatch(fetchMovies(searchQuery, movies.length / 20 + 1)); // Assuming each page has 20 movies
    }
  };
  const handleSearch = () => {
    dispatch(fetchMovies(searchQuery, 1)); // Always search from the first page
    useEffect(() => {
      if (!searchQuery) {
        // Load initial or refreshed movies only if not searching
        dispatch(fetchMovies('', 1)); // Load first page
      }
    }, [searchQuery, dispatch]);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      if (!state.isConnected) {
        Alert.alert('You are offline. Some features may not be available.');
      }
    });

    return () => unsubscribe();
  }, []);

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
    backgroundColor: '#f4f4f8', // un fond mai deschis
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0, // eliminăm border-ul
    padding: 10,
    borderRadius: 20, // borduri rotunjite
    backgroundColor: '#fff', // fundal alb pentru input
    shadowColor: '#000', // adăugăm o umbră
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
    backgroundColor: 'transparent', // buton transparent
    borderColor: '#0066cc',
    borderWidth: 1,
    borderRadius: 20, // borduri rotunjite pentru buton
    marginHorizontal: 100, // margini laterale pentru a restrânge butonul
    marginTop: 10, // spațiu deasupra butonului
  },
});

export default HomeScreen;
