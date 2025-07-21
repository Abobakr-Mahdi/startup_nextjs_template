# Template Project Structure

This document explains the project structure after the feature-based refactoring.

## Overview

The project follows a feature-based architecture, organizing code by business domains rather than technical concerns. This improves maintainability, scalability, and developer experience by keeping related code together.

## Top-level Directory Structure

- `src/` - Main source code directory
  - `app/` - Next.js app router pages and layouts
  - `components/` - Shared UI components
  - `config/` - Application configuration
  - `constants/` - Global constants
  - `features/` - Feature modules (NEW)
  - `hooks/` - Global hooks
  - `lib/` - Utility libraries
  - `providers/` - React context providers
  - `routes/` - Route definitions and utilities (NEW)
  - `services/` - Global services
  - `store/` - Redux store configuration
  - `styles/` - Global styles
  - `types/` - Global TypeScript types
  - `middleware.ts` - Next.js middleware

## Feature-based Structure

Each feature in the `features/` directory follows a consistent structure:

```
features/
├── auth/
│   ├── components/
│   │   └── (Auth-specific components)
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── store/
│   │   └── authSlice.ts
│   ├── types/
│   │   └── auth.ts
│   └── index.ts (Exports all feature modules)
├── dashboard/
│   ├── components/
│   ├── hooks/
│   │   └── useDashboard.ts
│   ├── services/
│   │   └── dashboardService.ts
│   ├── types/
│   │   └── dashboard.ts
│   └── index.ts
└── (other features)
```

## Services Layer

The services layer has been restructured:

```
services/
├── api/
│   ├── apiClient.ts (Centralized API client)
│   ├── errorHandling.ts (Error handling utilities)
│   └── responseHandling.ts (Response processing utilities)
├── custom-errors.ts (Custom error classes)
└── (other service files)
```

## Routes Configuration

Route configuration is now centralized:

```
routes/
├── index.ts (Route definitions and utilities)
└── protectedRoutes.ts (Authentication route protection)
```

## Using Features

Features are consumed through their index files:

```javascript
// Import everything from a feature
import * as AuthFeature from '@/features/auth';

// Import specific exports
import { useAuth } from '@/features/auth';
import { DashboardData } from '@/features/dashboard';
```

## Benefits of This Structure

1. **Cohesion** - Related code is grouped together
2. **Isolation** - Features are self-contained and reusable
3. **Discoverability** - Easy to find all aspects of a feature
4. **Scalability** - New features can be added without affecting others
5. **Testing** - Features can be tested in isolation
6. **Maintenance** - Changes to one feature don't affect others
