import { configureStore } from '@reduxjs/toolkit';
import { emailReducer } from '../reducers/reducers';

export const store = configureStore({
  reducer: {
    email: emailReducer
  }
});
