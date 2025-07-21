import { QueryClient } from "@tanstack/react-query";
import { ErrorWithStatus } from "@/services/api/errorHandling";

/**
 * Creates a configured QueryClient with optimal defaults
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour

        retry: (failureCount, error) => {
          // Don't retry on client errors (4xx)
          const err = error as ErrorWithStatus;
          if (
            err instanceof Error &&
            typeof err.statusCode === "number" &&
            err.statusCode >= 400 &&
            err.statusCode < 500
          ) {
            return false;
          }
          // Retry up to 2 times
          return failureCount < 2;
        },

        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Helper to generate query keys for consistent caching
 * Uses the feature-based architecture to organize cache keys
 */
export function createQueryKeys(feature: string) {
  return {
    all: [feature] as const,
    list: () => [...createQueryKeys(feature).all, "list"] as const,
    detail: (id: string | number) =>
      [...createQueryKeys(feature).all, "detail", id] as const,
    search: (params: Record<string, unknown>) =>
      [...createQueryKeys(feature).all, "search", params] as const,
  };
}

/**
 * Common query keys used across the application
 */
export const queryKeys = {
  auth: createQueryKeys("auth"),
  dashboard: createQueryKeys("dashboard"),
  user: createQueryKeys("user"),
  // Add more features here as needed
};

// For backward compatibility - will be removed in future
export const queryClient = createQueryClient();
