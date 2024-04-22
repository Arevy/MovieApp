import axios from 'axios';
import {MovieDetailsInterface} from 'src/interfaces/MovieInterface';

const apiKey = '28c23bbea6c9b1a62fa6d500cbb9f94a'; // TMDB API key

const baseUrl = 'https://api.themoviedb.org/3';

// Fetch popular movies list
export const getPopularMovies = async () => {
  const response = await axios.get(
    `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
  );
  return response.data.results;
};

// Fetch detailed information about a specific movie by its ID
export const getMovieDetails = async (id: number) => {
  const response = await axios.get(
    `${baseUrl}/movie/${id}?api_key=${apiKey}&language=en-US`,
  );
  return response.data;
};

// Fetch extended movie details including credits and reviews
export const getMovieDetailsExtended = async (id: number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=credits,reviews`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Acum error este tipizat ca AxiosError
      const message = error.response?.data?.status_message || error.message;
      console.error('Error fetching movie details:', message);
      throw new Error(`Error fetching movie details: ${message}`);
    } else {
      // Tratează cazul când eroarea nu este de la axios
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const fetchMovies = async (query: string = '') => {
  const url = query
    ? `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query,
      )}`
    : `${baseUrl}/movie/popular?api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    throw new Error(`Error fetching movies: ${error}`);
  }
};
