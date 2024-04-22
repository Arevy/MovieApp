import axios, {AxiosError} from 'axios';
import {Dispatch} from 'redux';

export const FETCH_MOVIES = 'FETCH_MOVIES';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGMyM2JiZWE2YzliMWE2MmZhNmQ1MDBjYmI5Zjk0YSIsInN1YiI6IjY2MjNhOWU5N2E5N2FiMDE0YThiYWE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZPVYKo-e9SBguxpX5rdV9nQ7D6kMl4AtUBMMreJTDaE';

export const fetchMovies = (query: string = '', page: number = 1) => {
  return async (dispatch: Dispatch) => {
    dispatch({type: FETCH_MOVIES});
    try {
      const url = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query,
          )}&api_key=${apiKey}&page=${page}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      });
      dispatch({
        type: FETCH_MOVIES_SUCCESS,
        payload: response.data.results,
        page: page,
        hasMore: response.data.page < response.data.total_pages,
      });
    } catch (error: any) {
      console.error('Error fetching data from TMDB:', error);
      dispatch({type: FETCH_MOVIES_FAILURE, payload: error.message});
    }
  };
};

export default fetchMovies;
