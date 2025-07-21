import { AxiosError } from "axios";
import {
  ApiError,
  AuthError,
  ForbiddenError,
  NetworkError,
  ServerError,
  ValidationError,
} from "../custom-errors";

export type ErrorResponse = {
  message: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
};

export interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  isValidationError?: boolean;
  isAuthError?: boolean;
}

export class ErrorHandler {
  /**
   * Handle any error and return a standardized error response
   */
  static handle(error: unknown): ErrorResponse {
    if (typeof window !== "undefined" && !window.navigator.onLine) {
      return {
        message:
          "You are currently offline. Please check your internet connection.",
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle Axios errors
    else if (error instanceof AxiosError) {
      const statusCode = error.response?.status;

      // Handle network errors
      if (!statusCode) {
        return {
          message: "Network error. Unable to connect to the server.",
          isNetworkError: true,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle unauthorized errors
      if (statusCode === 401) {
        return {
          message:
            error.response?.data?.message ||
            "Authentication failed. Please login again.",
          statusCode,
          isNetworkError: false,
          isAuthError: true,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle forbidden errors
      if (statusCode === 403) {
        return {
          message:
            error.response?.data?.message ||
            "You don't have permission to access this resource.",
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle not found errors
      if (statusCode === 404) {
        return {
          message:
            error.response?.data?.message ||
            "The requested resource was not found.",
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle validation errors
      if (statusCode === 422) {
        return {
          message:
            error.response?.data?.message ||
            "Validation failed. Please check your input.",
          statusCode,
          validationErrors: error.response?.data?.errors,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: true,
          isServerError: false,
        };
      }

      // Handle server errors
      if (statusCode >= 500) {
        return {
          message:
            error.response?.data?.message ||
            "An unexpected server error occurred.",
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: true,
        };
      }

      // Handle other HTTP errors
      return {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
        statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle ApiError
    else if (error instanceof ApiError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle known custom errors
    else if (error instanceof NetworkError) {
      return {
        message: error.message,
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof AuthError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: true,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof ForbiddenError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof ValidationError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        validationErrors: error.errors,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: true,
        isServerError: false,
      };
    } else if (error instanceof ServerError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: true,
      };
    }

    // Handle Error objects
    else if (error instanceof Error) {
      return {
        message: error.message || "An unexpected error occurred.",
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle unknown errors
    else {
      return {
        message: String(error) || "An unknown error occurred.",
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }
  }
}
