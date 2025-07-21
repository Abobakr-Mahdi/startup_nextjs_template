"use client";

import "@/styles/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-6xl font-bold text-destructive">Error</h1>
          <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-muted-foreground">
            {process.env.NODE_ENV === "development"
              ? error.message
              : "An unexpected error has occurred."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 mt-6 text-white rounded-md bg-primary hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
