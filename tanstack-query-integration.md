# TanStack Query Integration

## Overview

This document explains how TanStack Query has been integrated into the application to provide robust data fetching, caching, and state management.

## Architecture

We've implemented a layered approach to TanStack Query:

1. **Centralized Query Layer** (`services/api/queryService.ts`)
   - Provides typed hooks for data fetching
   - Integrates with our existing error handling
   - Supports both cached queries and uncached mutations

2. **Feature-Specific Services** (`features/*/services`)
   - Define domain-specific data fetching functions
   - Implement business logic for data transformation

3. **Feature Hooks** (`features/*/hooks`)
   - Use the query layer to fetch and cache data
   - Present a clean API to components
   - Handle loading, error, and success states

## Key Components

### QueryClient Configuration (`lib/query.ts`)

- Configures global settings for all queries
- Sets default caching behavior
- Implements smart retry logic

### API Query Hooks (`services/api/queryService.ts`)

- `useApiQuery`: For GET requests with automatic caching
- `useApiQueryWithParams`: For parameterized GET requests
- `useApiMutation`: For POST, PUT, PATCH, and DELETE operations
- `useDirectApiCall`: For special cases where hooks aren't appropriate (auth flows)

### Auth Hooks (`features/auth/services/authService.ts`)

- `useLogin`: For user authentication
- `useLogout`: For user logout
- Support for both hook-based and non-hook-based usage

## Usage Examples

### Standard Query

```typescript
// In a feature hook
const { data, isLoading, error } = useApiQuery<UserData>(
  '/users/profile', 
  ['users', 'profile'], 
  { staleTime: 300000 }
);
```

### Custom Query Function

```typescript
// When using a custom function
const { data, isLoading } = useApiQuery<DashboardData>(
  null,
  ['dashboard'],
  { 
    queryFn: getDashboardData,
    staleTime: 60000
  }
);
```

### Mutation

```typescript
const { mutate, isLoading } = useApiMutation<UpdateResponse, UpdateRequest>({
  endpoint: '/users/profile',
  method: 'put',
  onSuccess: (data) => {
    // Handle success
  }
});

// Usage
mutate({ name: 'New Name' });
```

### Direct API Call

```typescript
// For auth flows
const { execute } = useDirectApiCall<LoginResponse, LoginRequest>(
  '/auth/login',
  'post'
);

// Usage
const handleLogin = async (credentials) => {
  const result = await execute(credentials);
};
```

## Benefits

1. **Centralized Configuration**
   - Consistent caching strategies across the app
   - Standardized error handling
   - Easier to maintain and update

2. **Reduced Boilerplate**
   - Abstracts away common patterns
   - Type-safe APIs
   - Consistent behavior

3. **Performance Improvements**
   - Smart caching reduces network requests
   - Background refetching improves data freshness
   - Deduplication of identical requests

4. **Enhanced Developer Experience**
   - Less code to write for data fetching
   - Consistent patterns throughout the app
   - Better type safety 