import { apiClient } from "@/services/api/apiClient";
import { LoginCredentials, User } from "../types/auth";
import { decrypt, isCryptoSupported } from "@/lib/crypto";
import { getCookie } from "@/lib/cookie";
import { COOKIE_NAMES } from "@/constants";
import { ResponseHandler, ErrorHandler } from "@/services/api";
import { ApiResponse, EndpointType } from "@/types";
import { appRoutes } from "@/routes";

/**
 * Get the authentication token from the cookie
 *
 * Note: For true HTTP-only cookies, this is not possible from client-side JavaScript
 * This function exists for compatibility with our mock implementation
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // In a real application with HTTP-only cookies, this would not be accessible
    // from JavaScript. The server would read the cookie directly.
    const tokenValue = getCookie(COOKIE_NAMES.AUTH_TOKEN);
    if (!tokenValue) return null;

    // Try to decode URI component first in case it's URL encoded
    let processedToken;
    try {
      processedToken = decodeURIComponent(tokenValue);
    } catch {
      processedToken = tokenValue;
    }

    // Decrypt if crypto is supported
    const decryptedToken = isCryptoSupported()
      ? await decrypt(processedToken)
      : processedToken;

    try {
      return JSON.parse(decryptedToken);
    } catch {
      return decryptedToken;
    }
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
}

/**
 * Get the user data from the cookie
 *
 * In a real app with HTTP-only cookies, you would make an API call
 * to get the user data instead of reading it from cookies directly
 */
export async function getUserData(): Promise<User | null> {
  try {
    // In a real application using HTTP-only cookies, you would call an API
    // endpoint that returns the user data based on the session token
    const userDataValue = getCookie(COOKIE_NAMES.USER_DATA);
    if (!userDataValue) return null;

    // Try to decode URI component first in case it's URL encoded
    let processedUserData;
    try {
      processedUserData = decodeURIComponent(userDataValue);
    } catch {
      processedUserData = userDataValue;
    }

    // Decrypt if crypto is supported
    const userData = isCryptoSupported()
      ? await decrypt(processedUserData)
      : processedUserData;

    try {
      return JSON.parse(userData) as User;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    throw ErrorHandler.handle(error);
  }
}

/**
 * Login with email and password
 * This sends a request to the API endpoint that sets HTTP-only cookies
 *
 * @param credentials The login credentials
 */
export async function login<T>(credentials: LoginCredentials): Promise<T> {
  try {
    // Use the apiClient with the appropriate endpoint type
    const response = await apiClient.post<ApiResponse<T>>(
      appRoutes.LOGIN.path,
      credentials,
      { endpointType: EndpointType.APP_API }
    );

    return ResponseHandler.process(response);
  } catch (error) {
    console.error("Login error:", error);
    throw ErrorHandler.handle(error);
  }
}

/**
 * Logout the user
 * This sends a request to the API endpoint that clears HTTP-only cookies
 */
export async function logout(): Promise<void> {
  try {
    // Use the apiClient with the appropriate endpoint type
    await apiClient.post<ApiResponse<void>>(appRoutes.LOGOUT.path, undefined, {
      endpointType: EndpointType.APP_API,
    });

    // The HTTP-only cookies are automatically cleared by the browser
  } catch (error) {
    console.error("Logout error:", error);
    throw ErrorHandler.handle(error);
  }
}
