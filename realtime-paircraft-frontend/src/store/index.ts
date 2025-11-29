import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import roomReducer from './slices/roomSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    room: roomReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
