// Combines all reducers for the Redux store

import {combineReducers} from 'redux';
import movieReducer from './movieReducer';

// Root reducer that combines all module reducers
const rootReducer = combineReducers({
  movie: movieReducer, // Reducer handling movie state
});

export default rootReducer;
