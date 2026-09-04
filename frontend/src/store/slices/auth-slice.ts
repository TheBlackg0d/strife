import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "../../auth/types/auth";

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenReceived: (
      state,
      action: PayloadAction<Pick<AuthResponse, "accessToken">>,
    ) => {
      state.accessToken = action.payload.accessToken;
    },
    loggedOut: (state) => {
      state.accessToken = null;
    },
  },
});

export const { tokenReceived, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
