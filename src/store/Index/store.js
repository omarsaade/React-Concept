import {configureStore} from '@reduxjs/toolkit';
import registerReducer from '../Slice/registerSlice';

export const store = configureStore({
  reducer: {
    register: registerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for development purposes
    }),
});
