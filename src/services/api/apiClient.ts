import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { siteConfig } from "@/config/site";
import { getCookie } from "@/lib/cookie";
import { COOKIE_NAMES } from "@/constants";
import { EndpointType } from "@/types";

// Create a function to determine the base URL based on the endpoint type
const getBaseUrl = (endpointType: EndpointType): string => {
  switch (endpointType) {
    case EndpointType.APP_API:
      return `/${siteConfig.apiMainPath}`;
    case EndpointType.DIRECT_API:
    default:
      return `${siteConfig.apiBaseUrl}/${siteConfig.apiMainPath}/${siteConfig.apiVersion}`;
  }
};

// Create a custom Axios instance with default configuration
const createAxiosInstance = (
  endpointType: EndpointType = siteConfig.defaultEndpointType
) => {
  const baseURL = getBaseUrl(endpointType);

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 10000, // 10 seconds
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      // Check if we have network connectivity before making the request
      if (typeof window !== "undefined" && !window.navigator.onLine) {
        return Promise.reject(new Error("No internet connection"));
      }

      // Add authorization token
      const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = token;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      // don't uncomment no need to refresh tokin in this project
      // const originalRequest = error.config as AxiosRequestConfig & {
      //   _retry?: boolean;
      // };

      // // Handle token refresh if 401 Unauthorized
      // if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;

      //   try {
      //     // Attempt to refresh token
      //     const refreshToken = getCookie(COOKIE_NAMES.REFRESH_TOKEN);
      //     if (refreshToken) {
      //       const response = await axios.post(
      //         `${siteConfig.apiBaseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
      //         { refreshToken }
      //       );

      //       // Get the new token from the refresh response
      //       const { token } = response.data;

      //       // Update cookies with the new token
      //       setCookie(COOKIE_NAMES.AUTH_TOKEN, token, { maxAge: 3600 });

      //       // Update the Authorization header
      //       axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

      //       // Retry the original request
      //       return axiosInstance(originalRequest);
      //     }
      //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   } catch (refreshError) {
      //     // Handle refresh token failure (redirect to login, etc.)
      //     if (typeof window !== "undefined") {
      //       window.location.href = ROUTES.LOGIN;
      //     }
      //   }
      // }

      // Pass error to the caller
      return Promise.reject(error);
    }
  );

  return instance;
};

// Default instance for direct API calls
// const directApiInstance = createAxiosInstance(EndpointType.DIRECT_API);
// Instance for app API routes
// const appApiInstance = createAxiosInstance(EndpointType.APP_API);

// Function to get the appropriate axios instance based on the endpoint type
const getAxiosInstance = (
  endpointType: EndpointType = siteConfig.defaultEndpointType
) => {
  return createAxiosInstance(endpointType);
};

// Type-safe API methods with endpoint type support
export const apiClient = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig & { endpointType?: EndpointType }
  ): Promise<AxiosResponse<T>> => {
    const { endpointType, ...restConfig } = config || {};
    return getAxiosInstance(endpointType).get<T>(url, restConfig);
  },

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { endpointType?: EndpointType }
  ): Promise<AxiosResponse<T>> => {
    const { endpointType } = config || {};
    return getAxiosInstance(endpointType).post<T>(url, data, config);
  },

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { endpointType?: EndpointType }
  ): Promise<AxiosResponse<T>> => {
    const { endpointType, ...restConfig } = config || {};
    return getAxiosInstance(endpointType).put<T>(url, data, restConfig);
  },

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { endpointType?: EndpointType }
  ): Promise<AxiosResponse<T>> => {
    const { endpointType, ...restConfig } = config || {};
    return getAxiosInstance(endpointType).patch<T>(url, data, restConfig);
  },

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig & { endpointType?: EndpointType }
  ): Promise<AxiosResponse<T>> => {
    const { endpointType, ...restConfig } = config || {};
    return getAxiosInstance(endpointType).delete<T>(url, restConfig);
  },
};

export default apiClient;
