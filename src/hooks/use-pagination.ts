"use client";

import { useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  PaginationParams,
  UsePaginationOptions,
  UsePaginationResult,
} from "@/types";
import { PAGINATION } from "@/constants";

export function usePagination<T>({
  queryKey,
  queryFn,
  defaultParams = {
    page: PAGINATION.DEFAULT_PAGE,
    perPage: PAGINATION.DEFAULT_PER_PAGE,
  },
  enabled = true,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [params, setParams] = useState<PaginationParams>(defaultParams);

  // Create the query function that accepts a page parameter
  const fetchData = useCallback(
    async ({ pageParam = PAGINATION.DEFAULT_PAGE }) => {
      const queryParams = { ...params, page: pageParam };
      return await queryFn(queryParams);
    },
    [params, queryFn]
  );

  // Set up the infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKey, params],
    queryFn: fetchData,
    initialPageParam: PAGINATION.DEFAULT_PAGE,
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: maxPage } = lastPage.meta;
      return currentPage < maxPage ? currentPage + 1 : undefined;
    },
    enabled,
    staleTime: 60 * 1000, // 1 minute
    // Use a different cache time for this query
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten the pages into a single array of items
  const flattenedData = data ? data.pages.flatMap((page) => page.response) : [];

  return {
    data: flattenedData,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage: hasNextPage || false,
    fetchNextPage,
    refetch,
    params,
    setParams: (newParams) => {
      // When params change, we'll reset and use the new params
      setParams(newParams);
      refetch();
    },
    isEmpty: flattenedData.length === 0 && !isLoading,
  };
}
