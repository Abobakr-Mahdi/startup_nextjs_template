"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout as logoutAction } from "../store/authSlice";
import {
  getUserData,
  login as loginService,
  logout as logoutService,
} from "../services/authService";
import {
  AuthOperation,
  AuthResponse,
  AuthStateHandlers,
  LoginCredentials,
} from "../types/auth";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/routes";

/**
 * Helper function to initialize authentication
 */
function useAuthInit(dispatch: ReturnType<typeof useDispatch>) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<AuthOperation>(
    AuthOperation.INIT
  );
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setCurrentOperation(AuthOperation.INIT);
        setAuthError(null);

        // Get user data from secure cookies via our service
        const userData = await getUserData();

        if (userData) {
          // Update Redux state
          dispatch(setUser(userData));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthError("Failed to retrieve authentication data");
      } finally {
        setIsLoading(false);
        setCurrentOperation(AuthOperation.NONE);
      }
    };

    initAuth();
  }, [dispatch]);

  return {
    isLoading,
    currentOperation,
    authError,
    setIsLoading,
    setCurrentOperation,
    setAuthError,
  };
}

/**
 * Login handler function
 */
function handleLogin(
  credentials: LoginCredentials,
  {
    setIsLoading,
    setCurrentOperation,
    setAuthError,
    dispatch,
  }: AuthStateHandlers
) {
  return async () => {
    try {
      setIsLoading(true);
      setCurrentOperation(AuthOperation.LOGIN);
      setAuthError(null);

      const response: AuthResponse = await loginService(credentials);

      dispatch(setUser(response.user));
      return response;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(
        "Login failed. Please check your credentials and try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
      setCurrentOperation(AuthOperation.NONE);
    }
  };
}

/**
 * Logout handler function
 */
function handleLogout(
  router: ReturnType<typeof useRouter>,
  {
    setIsLoading,
    setCurrentOperation,
    setAuthError,
    dispatch,
  }: AuthStateHandlers
) {
  return async () => {
    try {
      setIsLoading(true);
      setCurrentOperation(AuthOperation.LOGOUT);
      setAuthError(null);

      await logoutService();

      // Clear Redux state
      dispatch(logoutAction());

      // Redirect to home page
      router.push(appRoutes.HOME.path);
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError("Logout failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
      setCurrentOperation(AuthOperation.NONE);
    }
  };
}

/**
 * Main authentication hook that provides all auth functionality
 */
export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Use the init helper to handle authentication initialization
  const {
    isLoading,
    currentOperation,
    authError,
    setIsLoading,
    setCurrentOperation,
    setAuthError,
  } = useAuthInit(dispatch);

  // Create the state handlers object wrapped in useMemo to prevent recreation on each render
  const stateHandlers: AuthStateHandlers = useMemo(
    () => ({
      setIsLoading,
      setCurrentOperation,
      setAuthError,
      dispatch,
    }),
    [setIsLoading, setCurrentOperation, setAuthError, dispatch]
  );

  // Create memoized login function
  const login = useCallback(
    (credentials: LoginCredentials) => {
      return handleLogin(credentials, stateHandlers)();
    },
    [stateHandlers]
  );

  // Create memoized logout function
  const logout = useCallback(
    () => handleLogout(router, stateHandlers)(),
    [router, stateHandlers]
  );

  // Create memoized clearError function
  const clearError = useCallback(() => setAuthError(null), [setAuthError]);

  return {
    // Auth state
    user,
    isAuthenticated,

    // Loading state
    isLoading,
    currentOperation,

    // Error state
    error: authError,

    // Auth operations
    login,
    logout,

    // Helper methods
    clearError,
  };
}
