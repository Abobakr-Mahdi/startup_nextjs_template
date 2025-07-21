// Export types
export * from "./types/auth";

// Export services
export {
  login as loginService,
  logout as logoutService,
  getAuthToken,
  getUserData,
} from "./services/authService";

// Export hook - now a single consolidated hook
export { useAuth } from "./hooks/useAuth";

// Export store
export * from "./store/authSlice";
