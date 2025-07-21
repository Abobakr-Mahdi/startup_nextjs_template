import {
  useQuery,
  useMutation,
  UseQueryOptions,
  QueryKey,
  UseMutationOptions,
  QueryFunction,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "./apiClient";
import { ResponseHandler } from "./responseHandling";
import { ErrorHandler } from "./errorHandling";
import { ApiResponse, EndpointType, HttpMethod } from "@/types";

/**
 * Options for useApiQuery hook
 */
export interface UseApiQueryOptions<TData = unknown, TError = unknown>
  extends Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "queryKey" | "queryFn"
  > {
  /**
   * Skip caching (useful for auth endpoints)
   */
  skipCache?: boolean;
  /**
   * Custom query function
   */
  queryFn?: QueryFunction<TData, QueryKey>;
  /**
   * Target API endpoint type (app API or direct API)
   */
  endpointType?: EndpointType;
}

/**
 * Options for useApiMutation hook
 */
export interface UseApiMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
> extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {
  /**
   * API endpoint to call
   */
  endpoint: string;
  /**
   * HTTP method (defaults to POST)
   */
  method?: HttpMethod;
  /**
   * Target API endpoint type (app API or direct API)
   */
  endpointType?: EndpointType;
}

/**
 * Hook for data fetching (READ operations) with built-in error handling and caching
 *
 * @param endpoint API endpoint to fetch data from
 * @param queryKey TanStack Query key for caching
 * @param options Query options including cache settings
 */
export function useApiQuery<TData = unknown>(
  endpoint: string | null,
  queryKey: QueryKey,
  options?: UseApiQueryOptions<TData, Error>
) {
  // Create a query function based on endpoint or use the custom one
  const defaultQueryFn: QueryFunction<TData, QueryKey> = async () => {
    if (!endpoint) {
      throw new Error(
        "Endpoint is required when no custom queryFn is provided"
      );
    }

    try {
      const response = await apiClient.get<ApiResponse<TData>>(endpoint, {
        endpointType: options?.endpointType,
      });
      return ResponseHandler.process(response);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  };

  // Use the provided queryFn if available, otherwise use the default one
  const queryFn = options?.queryFn || defaultQueryFn;

  // Remove our custom options before passing to useQuery
  const { ...queryOptions } = options || {};

  return useQuery({
    queryKey,
    queryFn,
    ...queryOptions,
  });
}

/**
 * Hook for data fetching with URL parameters (GET with params)
 */
export function useApiQueryWithParams<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  endpoint: string,
  params: TParams,
  queryKey: QueryKey,
  options?: UseApiQueryOptions<TData, Error>
) {
  const fetchData = async (): Promise<TData> => {
    try {
      const config: AxiosRequestConfig & { endpointType?: EndpointType } = {
        params,
        endpointType: options?.endpointType,
      };

      const response = await apiClient.get<ApiResponse<TData>>(
        endpoint,
        config
      );
      return ResponseHandler.process(response);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  };

  // Remove our custom options before passing to useQuery

  const { ...queryOptions } = options || {};

  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: fetchData,
    ...queryOptions,
  });
}

/**
 * Hook for data mutations (WRITE operations) with built-in error handling
 *
 * @param options Mutation options including endpoint and method
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  options: UseApiMutationOptions<TData, Error, TVariables>
) {
  const {
    endpoint,
    method = HttpMethod.POST,
    endpointType,
    ...mutationOptions
  } = options;

  const mutationFn = async (variables: TVariables): Promise<TData> => {
    try {
      let response;
      const config = { endpointType };

      switch (method) {
        case HttpMethod.PUT:
          response = await apiClient.put<ApiResponse<TData>>(
            endpoint,
            variables,
            config
          );
          break;
        case HttpMethod.PATCH:
          response = await apiClient.patch<ApiResponse<TData>>(
            endpoint,
            variables,
            config
          );
          break;
        case HttpMethod.DELETE:
          response = await apiClient.delete<ApiResponse<TData>>(
            endpoint,
            config
          );
          break;
        case HttpMethod.POST:
        default:
          response = await apiClient.post<ApiResponse<TData>>(
            endpoint,
            variables,
            config
          );
          break;
      }

      return ResponseHandler.process(response);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  };

  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}

/**
 * Hook for direct API calls without caching (useful for auth flows)
 *
 * @param endpoint API endpoint
 * @param method HTTP method
 * @param endpointType Target API endpoint type
 */
export function useDirectApiCall<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: HttpMethod,
  endpointType?: EndpointType
) {
  const execute = async (
    variables?: TVariables,
    config?: Omit<AxiosRequestConfig, "endpointType">
  ): Promise<TData> => {
    try {
      let response;
      const axiosConfig = { ...config, endpointType };

      switch (method) {
        case HttpMethod.GET:
          response = await apiClient.get<ApiResponse<TData>>(
            endpoint,
            axiosConfig
          );
          break;
        case HttpMethod.PUT:
          response = await apiClient.put<ApiResponse<TData>>(
            endpoint,
            variables,
            axiosConfig
          );
          break;
        case HttpMethod.PATCH:
          response = await apiClient.patch<ApiResponse<TData>>(
            endpoint,
            variables,
            axiosConfig
          );
          break;
        case HttpMethod.DELETE:
          response = await apiClient.delete<ApiResponse<TData>>(
            endpoint,
            axiosConfig
          );
          break;
        case HttpMethod.POST:
        default:
          response = await apiClient.post<ApiResponse<TData>>(
            endpoint,
            variables,
            axiosConfig
          );
          break;
      }

      return ResponseHandler.process(response);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  };

  return { execute };
}
