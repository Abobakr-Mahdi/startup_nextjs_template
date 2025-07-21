# Startup Template NextJS Application

This is a feature-rich Next.js application built with TypeScript, Redux, and TanStack Query. The application follows a feature-based architecture with a focus on maintainability and separation of concerns.

## Architecture Overview

The application is structured using a feature-based architecture, where code is organized around business domains rather than technical concerns. This architecture provides:

1. **Better Isolation**: Each feature is self-contained with its own components, services, hooks, and types.
2. **Improved Maintainability**: Changes to one feature are less likely to affect others.
3. **Clear API Boundaries**: Features expose clear public APIs through their index.ts files.

## Directory Structure

```
src/
├── app/                     # Next.js App Router 
├── components/              # Shared UI components
├── config/                  # App configuration
├── constants/               # Global constants
├── features/                # Feature modules
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth-specific components
│   │   ├── hooks/           # Auth-specific hooks
│   │   ├── services/        # Auth-specific services
│   │   ├── store/           # Auth-related state management
│   │   ├── types/           # Auth-related types
│   │   └── index.ts         # Public API for the auth feature
│   └── dashboard/           # Dashboard feature
│       ├── components/      # Dashboard-specific components
│       ├── hooks/           # Dashboard-specific hooks
│       ├── services/        # Dashboard-specific services
│       ├── store/           # Dashboard-related state management
│       ├── types/           # Dashboard-related types
│       └── index.ts         # Public API for the dashboard feature
├── hooks/                   # Global hooks
├── lib/                     # Utility libraries
├── providers/               # React context providers
├── routes/                  # Route definitions & guards
├── services/                # Shared services
│   ├── api/                 # API integration 
│   │   ├── apiClient.ts     # Base Axios configuration
│   │   ├── errorHandling.ts # Centralized error handling
│   │   ├── queryService.ts  # TanStack Query integration
│   │   └── index.ts         # API service exports
│   └── custom-errors.ts     # Application-specific error classes
├── store/                   # Global Redux store configuration
├── styles/                  # Global styles
└── types/                   # Global TypeScript types
```

## Key Features

### Data Fetching

- **TanStack Query Integration**: Smart caching of server state with automatic revalidation
- **Custom Query Hooks**: Feature-specific hooks that leverage TanStack Query
- **Error Handling**: Centralized error handling for API requests

### State Management

- **Redux**: For global state that needs to be accessed by many components
- **React Context**: For more localized state that doesn't need Redux
- **TanStack Query**: For server state and caching

### Authentication

- **Secure Cookie Authentication**: HTTP-only cookies for token storage
- **Role-based Access Control**: Route protection based on user roles
- **Server-side Authentication**: Using Next.js middleware

### Feature-based Architecture

- **Self-contained Modules**: Each feature has its own directory with all related code
- **Clear Public APIs**: Features expose their functionality through index.ts files
- **Minimal Cross-feature Dependencies**: Features are designed to be as independent as possible

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guidelines

### Creating a New Feature

1. Create a new directory in `src/features/`
2. Add the following subdirectories as needed:
   - `components/`: UI components specific to this feature
   - `hooks/`: React hooks specific to this feature
   - `services/`: API services specific to this feature
   - `store/`: State management specific to this feature
   - `types/`: TypeScript types specific to this feature
3. Create an `index.ts` file that exports the public API of your feature

### Best Practices

1. **Keep Components Small**: Extract reusable parts into separate components
2. **Use TanStack Query for Data Fetching**: Prefer the `useApiQuery` and `useApiMutation` hooks from our queryService
3. **Follow TypeScript Best Practices**: Define proper interfaces for props and state
4. **Maintain Feature Isolation**: Minimize dependencies between features
5. **Document Public APIs**: Add JSDoc comments to exported functions, components, and types

## Internationalization

This template supports both English and Arabic languages, with automatic RTL/LTR switching. Translation files are located in the `messages` directory.

## Authentication

Authentication is handled with secure HTTPOnly cookies, compatible with both client and server components.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
