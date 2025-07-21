/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  USER: {
    PROFILE: "/profile/index",
    UPDATE_PROFILE: "/profile/update",
  },
};

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
  LOCALE: "NEXT_LOCALE",
  THEME: "site-theme",
  USER_DATA: "user-data",
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

/**
 * Application timing constants (in milliseconds)
 */
export const TIMINGS = {
  API_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_SEARCH: 300, // 300 milliseconds
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  NOTIFICATION_DISPLAY: 5000, // 5 seconds
  ANIMATION_FADE: 500, // 500 milliseconds
  NETWORK_STATUS_TRANSITION: 2000, // 500 milliseconds
};

/**
 * Regular expressions for validation
 */
export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(ftp|http|https):\/\/[^ "]+$/,
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50, 100],
};

/**
 * Cookie settings
 */
export const COOKIE_SETTINGS = {
  LOCALE_MAX_AGE: 31536000, // 1 year in seconds
  PATH: "/",
  AUTH_MAX_AGE: 86400, // 1 day in seconds
  SECURE: true,
  HTTP_ONLY: true,
  SAME_SITE: "strict" as const,
};

/**
 * CSS class utilities
 */
export const CSS_CLASSES = {
  ACTIVE_BUTTON: "bg-primary text-primary-foreground",
  INACTIVE_BUTTON:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  INACTIVE_BUTTON_PRIMARY_HOVER:
    "bg-secondary text-secondary-foreground hover:bg-primary/10",
};

export const QUERY_STATE_MANAGERS = {
  CALLBACK_URL: "callbackUrl",
};

/**
 * Auth related constants
 */
export const AUTH = {
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
  },
  DEFAULT_ROLE: "user",
  SESSION_DURATION: 86400 * 1000, // 1 day in milliseconds
};
