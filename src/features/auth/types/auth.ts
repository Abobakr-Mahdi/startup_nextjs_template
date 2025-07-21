import { useDispatch } from "react-redux";

/**
 * User model
 */
export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  access_token?: string;
  role?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  identifier: string;
  password: string;
  login_method?: string;
}

/**
 * Complete auth response with tokens
 */
export interface AuthResponse {
  user: User;
  access_token: string;
  refreshToken?: string;
}

/**
 * Registration credentials
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

/**
 * Registration response
 */
export interface RegisterResponse {
  user: User;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
}

/**
 * Operation types
 */
export enum AuthOperation {
  INIT = "init",
  LOGIN = "login",
  LOGOUT = "logout",
  NONE = "none",
}

/**
 * Auth state management functions
 */
export type AuthStateHandlers = {
  setIsLoading: (isLoading: boolean) => void;
  setCurrentOperation: (operation: AuthOperation) => void;
  setAuthError: (error: string | null) => void;
  dispatch: ReturnType<typeof useDispatch>;
};
