import { ApiErrorResponse } from "@/types";

/**
 * Base class for all API related errors
 */
export class ApiError extends Error implements ApiErrorResponse {
  public readonly statusCode?: number;
  public readonly code?: string;
  success: false;
  response?: { message: string } | null | undefined;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.success = false;
    this.response = { message: message };

    // Fixes the prototype chain for ES5
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error thrown when the network is unavailable
 */
export class NetworkError extends ApiError {
  constructor(message = "Network error occurred") {
    super(message);
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthError extends ApiError {
  constructor(message = "Authentication failed", statusCode = 401) {
    super(message, statusCode);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Error thrown when a request is unauthorized
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Access forbidden", statusCode = 403) {
    super(message, statusCode);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found", statusCode = 404) {
    super(message, statusCode);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error thrown when a validation error occurs
 */
export class ValidationError extends ApiError {
  public readonly errors?: Record<string, string[]>;

  constructor(
    message = "Validation failed",
    errors?: Record<string, string[]>,
    statusCode = 422
  ) {
    super(message, statusCode);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when the server returns a 500 error
 */
export class ServerError extends ApiError {
  constructor(message = "Internal server error", statusCode = 500) {
    super(message, statusCode);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends ApiError {
  constructor(message = "Request timed out") {
    super(message, 408);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
