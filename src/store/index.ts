import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
//从slice引入reducer
import ReSlice from '../redux/ReSlice'





export const store = configureStore({
  reducer: {
    replay: ReSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;