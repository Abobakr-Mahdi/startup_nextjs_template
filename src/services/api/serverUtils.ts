import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { ApiErrorResponse, ApiResponse, HttpMethod } from "@/types";

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message = "Operation successful"
) {
  return NextResponse.json({
    success: true,
    message,
    response: data,
  });
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  message: string,
  status = 400,
  code?: string,
  responseData: { message: string } | null = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      response: responseData,
    } as ApiErrorResponse,
    { status }
  );
}

/**
 * Server-side API client for use in API routes
 * This enables consistent request/response handling between client and server code
 */
export const serverApiClient = {
  /**
   * Makes a request to the external API
   */
  request: async <T>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<{ data: ApiResponse<T>; response: Response }> => {
    const baseUrl = `${siteConfig.apiBaseUrl}/${siteConfig.apiMainPath}/${siteConfig.apiVersion}`;
    const fullUrl = url.startsWith("http")
      ? url
      : `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = (await response.json()) as ApiResponse<T>;
      return { data, response };
    } catch (error) {
      console.error(
        `[Server API Client] Error calling ${method} ${url}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Process a client request and forward it to the external API
   */
  handleRequest: async <T>(
    request: NextRequest | undefined,
    endpoint: string,
    method: HttpMethod = HttpMethod.GET,
    options: {
      transformRequestBody?: (body: unknown) => unknown;
      transformResponseBody?: (data: ApiResponse<T>) => unknown;
    } = {}
  ) => {
    try {
      // Get and potentially transform request body
      let requestBody = undefined;
      if (method !== HttpMethod.GET && method !== HttpMethod.DELETE) {
        try {
          const body = await request?.json();
          requestBody = request
            ? options.transformRequestBody
              ? options.transformRequestBody(body)
              : body
            : null;
        } catch (error) {
          console.error("Error parsing request body:", error);
          return createErrorResponse("Invalid request body", 400);
        }
      }

      // Forward request to external API
      const { data, response } = await serverApiClient.request<T>(
        endpoint,
        method,
        requestBody,
        {
          // Forward authorization header if present
          ...(request?.headers.get("Authorization")
            ? { Authorization: request.headers.get("Authorization")! }
            : {}),
        }
      );

      // Handle API error responses
      if (!response.ok || (data && data.success === false)) {
        return createErrorResponse(
          data.message || "An error occurred while processing your request",
          response.status,
          data.code,
          data.response as { message: string } | null
        );
      }

      // Transform and return successful response
      const responseBody = options.transformResponseBody
        ? options.transformResponseBody(data)
        : data;
      return NextResponse.json(responseBody);
    } catch (error) {
      console.error("[API Route Handler] Unhandled error:", error);
      return createErrorResponse("An unexpected error occurred", 500);
    }
  },
};
