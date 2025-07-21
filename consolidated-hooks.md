# Consolidated Hooks Pattern

## Overview

This document outlines the consolidated hooks pattern we've implemented in the auth feature, which centralizes related functionality into a single, comprehensive hook rather than multiple specialized hooks.

## From Multiple Hooks to Consolidated Hook

### Previous Implementation

```
src/features/auth/hooks/
├── useAuth.ts       # Basic auth state and logout
├── useLogin.ts      # Login functionality 
└── useLogout.ts     # Logout functionality
```

In this approach, we had separate hooks for different auth operations, requiring components to import multiple hooks when needing different auth functionality.

### Current Implementation

```
src/features/auth/hooks/
└── useAuth.ts       # All auth functionality in one hook
```

With the consolidated approach, we have a single `useAuth` hook that provides all auth-related functionality, making the API simpler and more intuitive.

## Simplified Loading State Management

Instead of maintaining multiple boolean loading states (one for each operation), we've implemented a more DRY approach:

1. **Single Loading Flag**: One `isLoading` boolean to indicate any operation in progress
2. **Operation Type**: A `currentOperation` state that indicates which operation is running
3. **Derived States**: Helper boolean properties derived from the combination of these two states

```typescript
// Inside useAuth hook
const [isLoading, setIsLoading] = useState(false);
const [currentOperation, setCurrentOperation] = useState<AuthOperation>('init');

// Later, in the return object
return {
  // Primary states
  isLoading,
  currentOperation,
  
  // Derived states for convenience
  isLoginLoading: isLoading && currentOperation === 'login',
  isLogoutLoading: isLoading && currentOperation === 'logout',
  isInitializing: isLoading && currentOperation === 'init',
};
```

This approach:

1. Reduces state duplication
2. Ensures loading states can't get out of sync
3. Provides more context about what's actually loading
4. Maintains backward compatibility with operation-specific boolean flags

### Usage in Components

Components can choose to use either the simple isLoading flag:

```jsx
const { isLoading, login } = useAuth();

// Simple usage
<button disabled={isLoading}>
  {isLoading ? 'Please wait...' : 'Login'}
</button>
```

Or they can use the more specific context with currentOperation:

```jsx
const { isLoading, currentOperation, login } = useAuth();

// More context-aware UI
<button disabled={isLoading}>
  {isLoading && currentOperation === 'login' 
    ? 'Signing in...' 
    : 'Login'}
</button>
```

## Benefits of the Consolidated Hook Pattern

### 1. Simpler Developer Experience

- **Single Import**: Developers only need to import one hook instead of multiple hooks
- **Discoverable API**: All related functionality is available from a single source
- **Consistent Naming**: No need to remember multiple hook names for related operations

### 2. Centralized State Management

- **Shared State**: Loading, error, and authentication states can be shared across operations
- **Reduced Duplicated Logic**: Common state handling code is not duplicated in multiple hooks
- **Consistent Error Handling**: Errors from different operations are handled in the same way

### 3. Better Composition

- **Related Operations Together**: Operations that should be composed (like login followed by fetching user data) can be handled in one place
- **Coordinated State Updates**: Changes to shared state are coordinated within the hook
- **Simplified Testing**: Testing a single hook is easier than testing multiple interrelated hooks

### 4. Clean Component Code

- **Simpler Component Logic**: Components don't need to coordinate between multiple hooks
- **Destructured API**: Components can destructure only the functionality they need
- **Standardized Patterns**: All components use the same consistent pattern to access auth functionality

## Implementation Guidelines

When implementing a consolidated hook:

1. **Group by Feature**: Each major feature (auth, dashboard, etc.) should have its own consolidated hook
2. **Expose Clear API**: Return an object with clear, descriptive property names
3. **Include All States**: Expose loading, error, and data states for all operations
4. **Provide Helper Methods**: Include utility functions like error clearing
5. **Keep Pure Logic in Services**: The hook should only contain React-specific logic, with pure business logic in service functions

## Example Usage

```jsx
function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Simple component that accesses only what it needs
  // from the consolidated hook
}

function UserProfile() {
  const { user, logout, isLoading, currentOperation } = useAuth();
  
  // Another component using different functionality
  // from the same hook
}
```

By following this pattern, we create a more intuitive API for developers while maintaining a clean separation between concerns.
