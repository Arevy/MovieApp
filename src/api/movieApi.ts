import axios, {AxiosError} from 'axios';
import {MovieDetailsInterface} from 'src/interfaces/MovieInterface';

// const apiKey = 'your_api_key_here'; // Replace with your actual TMDB API key
const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGMyM2JiZWE2YzliMWE2MmZhNmQ1MDBjYmI5Zjk0YSIsInN1YiI6IjY2MjNhOWU5N2E5N2FiMDE0YThiYWE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZPVYKo-e9SBguxpX5rdV9nQ7D6kMl4AtUBMMreJTDaE';

const baseUrl = 'https://api.themoviedb.org/3';

export const getPopularMovies = async () => {
  const response = await axios.get(
    `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
  );
  return response.data.results;
};

export const getMovieDetails = async (id: number) => {
  const response = await axios.get(
    `${baseUrl}/movie/${id}?api_key=${apiKey}&language=en-US`,
  );
  return response.data;
};

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
