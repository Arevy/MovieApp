import axios from 'axios';
import {Dispatch} from 'redux';

// Action types for managing movie data fetch states
export const FETCH_MOVIES = 'FETCH_MOVIES';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

// TMDB API key, normally you would keep this secure and not hard-coded
const apiKey = '28c23bbea6c9b1a62fa6d500cbb9f94a';

// Fetch movies either by query or popular ones if no query is provided
export const fetchMovies = (query = '', page = 1) => {
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
