"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// Custom error type for status codes
interface ErrorWithStatus extends Error {
  status?: number;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session
  // This ensures that data isn't shared between users and browser sessions
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reasonable defaults for data freshness
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60, // 1 hour

            // Retry settings for failed queries
            retry: (failureCount, error) => {
              // Don't retry on 4xx client errors
              const err = error as ErrorWithStatus;
              if (
                err instanceof Error &&
                typeof err.status === "number" &&
                err.status >= 400 &&
                err.status < 500
              ) {
                return false;
              }
              // Retry up to 2 times on other errors
              return failureCount < 2;
            },

            // Make queries more responsive
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Don't retry mutations - they should be explicitly attempted by the user
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
