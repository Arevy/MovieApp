import {
  FETCH_MOVIES,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
} from '../actions/movieActions';
import {MovieInterface} from '../interfaces/MovieInterface';
interface MovieState {
  movies: MovieInterface[];
  loading: boolean;
  error: any;
  page: number;
  hasMore: boolean;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

const movieReducer = (state = initialState, action: any): MovieState => {
  switch (action.type) {
    case FETCH_MOVIES:
      // Resetăm lista și pagina când începem o nouă căutare
      if (action.page === 1) {
        return {...initialState, loading: true};
      }
      return {...state, loading: true};
    case FETCH_MOVIES_SUCCESS:
      // Concatenăm numai filme noi și actualizăm pagina și hasMore
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
