/**
 * Endpoint types for differentiating between API call targets
 */
export enum EndpointType {
  APP_API = "app_api", // Call through app API routes
  DIRECT_API = "direct_api", // Call directly to external API
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  response?: T;
  code?: string;
  errors?: Record<string, string[]>;
  meta?: {
    pagination?: {
      total: number;
      current_page: number;
      per_page: number;
      last_page: number;
      from: number;
      to: number;
      links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
    };
  };
}

/**
 * Paginated API response structure
 */
export interface PaginatedApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  response?: {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  };
}

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  response?: {
    message: string;
  } | null;
}

// Common pagination types
export interface PaginationParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | number | boolean>;
}

export interface PaginatedResponse<T> {
  response: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
}

// Pagination hook types
export interface UsePaginationOptions<T> {
  queryKey: string[];
  queryFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  defaultParams?: PaginationParams;
  enabled?: boolean;
}

export interface UsePaginationResult<T> {
  data: T[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  params: PaginationParams;
  setParams: (params: PaginationParams) => void;
  isEmpty: boolean;
}

// App config types
export interface AppConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  supportEmail: string;
}

// Theme types
export type Theme = "light" | "dark" | "system";

export type NotificationType = "info" | "success" | "warning" | "error";

// Direction types for RTL support
export type Direction = "ltr" | "rtl";

// Form field validation helpers
export interface ValidationError {
  message: string;
  type: string;
  ref?: unknown;
}

// Http method types
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
