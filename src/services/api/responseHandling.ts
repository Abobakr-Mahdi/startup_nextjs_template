import { AxiosResponse } from "axios";
import { ApiResponse, PaginatedApiResponse } from "@/types";

/**
 * Wrapper for API responses to standardize handling
 */
export class ResponseHandler {
  /**
   * Process an API response
   * @param response The Axios response
   * @returns Processed data from the response
   */
  static process<T>(response: AxiosResponse<ApiResponse<T>>): T {
    // If the API doesn't follow the standard structure, we handle it here
    if (response.data.success === undefined) {
      return response.data as unknown as T;
    }

    // Check if the response indicates a failure
    if (response.data.success === false) {
      throw new Error(
        response.data.message || "An error occurred with the API response"
      );
    }

    // Return the data if everything is fine
    return response.data.response as T;
  }

  /**
   * Process a paginated API response
   * @param response The Axios response containing pagination
   * @returns Processed data with pagination metadata
   */
  static processPaginated<T>(
    response: AxiosResponse<ApiResponse<T[]> | PaginatedApiResponse<T>>
  ): PaginatedApiResponse<T> {
    // Process the response to check for success
    if (response.data.success === false) {
      throw new Error(
        response.data.message || "An error occurred with the API response"
      );
    }

    // Check which response structure we're dealing with
    // If it's the newer format with response.data
    if (
      "response" in response.data &&
      response.data.response &&
      "data" in response.data.response
    ) {
      const paginatedResponse = response.data as PaginatedApiResponse<T>;
      const paginationData = paginatedResponse.response!;

      return {
        response: {
          data: paginationData.data,
          total: paginationData.total,
          per_page: paginationData.per_page,
          current_page: paginationData.current_page,
          last_page: paginationData.last_page,
          from: paginationData.from,
          to: paginationData.to,
          links: paginationData.links,
        },
        success: true,
        message: paginatedResponse.message,
      };
    }

    // Otherwise use the older format with meta.pagination
    else {
      const apiResponse = response.data as ApiResponse<T[]>;
      const data = this.process<T[]>(
        response as AxiosResponse<ApiResponse<T[]>>
      );

      // Extract pagination metadata
      const pagination = apiResponse.meta?.pagination || {
        total: 0,
        current_page: 1,
        per_page: 10,
        last_page: 1,
        from: 0,
        to: 0,
        links: {
          first: "",
          last: "",
          prev: null,
          next: null,
        },
      };

      // Return standardized response
      return {
        response: {
          data: data,
          total: pagination.total,
          per_page: pagination.per_page,
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          from: pagination.from,
          to: pagination.to,
          links: pagination.links,
        },
        success: true,
        message: apiResponse.message,
      };
    }
  }
}
