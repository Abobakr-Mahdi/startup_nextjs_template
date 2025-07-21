# Architectural Fix: Separating Business Logic from Hooks

## The Issue

In our previous architecture implementation, we had a design inconsistency where service layers contained React hooks. This violated the separation of concerns principle and made our services less reusable.

## The Solution

We've implemented a clear separation between the service layer (business logic) and the hooks layer (React component logic):

### 1. Service Layer (Pure Business Logic)

The service layer now contains only pure business functions without any React hooks:

```typescript
// src/features/auth/services/authService.ts

export async function login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
  // Pure business logic with no React dependencies
  const credentials = { email, password, rememberMe };
  
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  
  return ResponseHandler.process(response);
}
```

### 2. Hooks Layer (React Component Logic)

React hooks are now in dedicated files in the hooks folder, using the services when needed:

```typescript
// src/features/auth/hooks/useLogin.ts

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { execute } = useDirectApiCall<LoginResponse, LoginCredentials>(
    API_ENDPOINTS.AUTH.LOGIN,
    'post'
  );
  
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await execute(credentials);
      return response;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    login,
    isLoading
  };
}
```

## Benefits of This Approach

1. **Improved Testability**: Pure business logic functions are easier to test without needing to mock React.
2. **Better Reusability**: Services can be used in both component and non-component contexts (API routes, server functions, etc.).
3. **Clearer Responsibility**: Each layer has a well-defined responsibility:
   - Services: Business operations and data manipulation
   - Hooks: React state management and component integration
4. **Independent Evolution**: Business logic can evolve independently from UI concerns.

## Implementation Changes

1. Moved React hooks from `authService.ts` to dedicated files:
   - `useLogin.ts`
   - `useLogout.ts`

2. Updated `useAuth.ts` to use the new dedicated hooks.

3. Updated the login page to use the new `useLogin` hook.

4. Ensured all service files contain only pure business logic functions.

## Guidelines for Future Development

When developing new features:

1. **Service Functions**: Should contain pure business logic with no React dependencies
   - Data fetching and processing
   - Business rules implementation
   - API interactions

2. **React Hooks**: Should be in dedicated files in the hooks folder
   - UI state management
   - Component lifecycle handling
   - Consumption of services

This approach creates a cleaner architecture that's easier to maintain and evolve. 