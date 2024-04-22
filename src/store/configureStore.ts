import {configureStore} from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['FETCH_MOVIES_FAILURE'],
        ignoredPaths: ['movie.error'],
      },
    }),
});

export default store;
