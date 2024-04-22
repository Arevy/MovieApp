// React component for rendering a single movie card in a list
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {MovieInterface} from '../interfaces/MovieInterface';

interface MovieCardProps {
  movie: MovieInterface; // Movie data to display
  onPress: (movieId: number) => void; // Callback for when movie is pressed
  onFavoritePress: (movieId: number) => void; // Callback for when favorite button is pressed
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(movie.id)} style={styles.card}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`}}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onFavoritePress(movie.id)}
            style={styles.button}>
            <Text style={styles.buttonText}>Favorite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 5,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});
