import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth-slice";
import { strifeApi, strifeAuthApi } from "../services/strife-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [strifeApi.reducerPath]: strifeApi.reducer,
    [strifeAuthApi.reducerPath]: strifeAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      strifeApi.middleware,
      strifeAuthApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
