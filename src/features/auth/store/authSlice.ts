import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../types/auth";

// Define the initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set the loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set the authenticated user
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    // Set the auth token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    // Set an auth error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Log out the user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { setLoading, setUser, setToken, setError, logout, clearError } =
  authSlice.actions;

// Export the reducer (both as default and named export)
export const authReducer = authSlice.reducer;
export default authSlice.reducer;
