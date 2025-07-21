"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { getUserData, getAuthToken } from "@/features/auth";
import { setUser, setToken } from "@/features/auth";

export function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  // Initialize auth state from secure cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get encrypted user data and token from secure cookies
        const userData = await getUserData();
        const authToken = await getAuthToken();

        if (userData && authToken) {
          // Update Redux state
          dispatch(setUser(userData));
          dispatch(setToken(authToken));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
