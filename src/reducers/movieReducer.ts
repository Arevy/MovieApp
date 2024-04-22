import {
  FETCH_MOVIES,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
} from '../actions/movieActions';
import {MovieInterface} from '../interfaces/MovieInterface';

// State type definition for movie data
interface MovieState {
  movies: MovieInterface[]; // List of movies
  loading: boolean; // Loading state indicator
  error: any; // Error state
  page: number; // Current page of movie data
  hasMore: boolean; // Indicator if more movies are available
}

// Initial state for movie data
const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

// Movie reducer that handles actions related to movie data
const movieReducer = (state = initialState, action: any): MovieState => {
  switch (action.type) {
    case FETCH_MOVIES:
      // Reset list and page when starting a new fetch
      return {...state, loading: true};
    case FETCH_MOVIES_SUCCESS:
      // Only append new movies and update page and hasMore status
      const newMovies = action.payload.filter(
        (movie: MovieInterface) => !state.movies.some(m => m.id === movie.id),
      );
      return {
        ...state,
        loading: false,
        movies:
          action.page === 1 ? action.payload : [...state.movies, ...newMovies],
        page: action.page,
        hasMore: action.hasMore,
      };
    case FETCH_MOVIES_FAILURE:
      return {...state, loading: false, error: action.payload, hasMore: false};
    default:
      return state;
  }
};

export default movieReducer;
