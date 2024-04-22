import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Text, Image, Alert, ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {RootStackParamList} from '../navigation/AppNavigator';
import {getMovieDetailsExtended} from '../api/movieApi';
import {fetchMovies} from '../actions/movieActions';
import {checkConnection, loadMoviesFromStorage} from '../utils/network';
import {Action, ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from 'src/store/configureStore';
import {MovieDetailsInterface} from 'src/interfaces/MovieInterface';

interface DetailsScreenProps {
  route: RouteProp<RootStackParamList, 'Details'>;
  navigation: StackNavigationProp<RootStackParamList, 'Details'>;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({route, navigation}) => {
  const {movieId} = route.params; // Getting movieId from navigation parameter
  const [movieDetails, setMovieDetails] =
    useState<MovieDetailsInterface | null>(null);

  const dispatch = useDispatch<ThunkDispatch<RootState, void, Action>>();

  // Check internet connectivity before making API calls
  const checkInternetConnection = async () => {
    const isConnected = await checkConnection();
    if (!isConnected) {
      Alert.alert(
        'You are currently offline. Some features may not be available.',
      );
    }
  };

  useEffect(() => {
    checkInternetConnection();
    dispatch(fetchMovies());
  }, [dispatch]);

  // Fetch movie details when the component is mounted or when movieId changes
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details: MovieDetailsInterface = await getMovieDetailsExtended(
          movieId,
        );
        setMovieDetails(details);
      } catch (error) {
        Alert.alert('Error fetching movie details');
        console.error(error);
      }
    };

    fetchDetails();
  }, [movieId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movies = await loadMoviesFromStorage();
      const movie = movies.find(m => m.id === movieId);
      if (movie) {
        setMovieDetails(movie);
      } else {
        console.log('Movie details not found in storage');
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movieDetails) return <Text>Loading details...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
        }}
        style={styles.image}
      />
      <Text style={styles.title}>{movieDetails.title}</Text>
      <Text style={styles.overview}>{movieDetails.overview}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  overview: {
    fontSize: 16,
    color: 'grey',
    marginTop: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailsScreen;
