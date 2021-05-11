import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import roomSlice from 'app/roomSlice';

export const store = configureStore({
  reducer: {
    room: roomSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
