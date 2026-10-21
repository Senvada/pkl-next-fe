"use client"

import { useMemo } from "react"
import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query"
import type { PaginationMeta } from "@/types/auth"
import { useIntersectionObserver } from "./use-intersection-observer"

export interface PaginatedResult<T> {
  items: T[]
  pagination?: PaginationMeta
}

export interface UseInfiniteScrollQueryOptions<T> {
  queryKey: QueryKey
  queryFn: (page: number, limit: number) => Promise<PaginatedResult<T>>
  limit?: number
  enabled?: boolean
  staleTime?: number
  rootRef?: React.RefObject<Element | null>
}

/**
 * Universal reusable infinite query hook with automatic sentinel intersection handling
 */
export function useInfiniteScrollQuery<T>({
  queryKey,
  queryFn,
  limit = 15,
  enabled = true,
  staleTime = 60 * 1000,
  rootRef,
}: UseInfiniteScrollQueryOptions<T>) {
  const infiniteQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.has_next) {
        return (lastPage.pagination.page || 1) + 1
      }
      return undefined
    },
    enabled,
    staleTime,
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery

  const items = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.items || [])
  }, [data])

  const latestPagination = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return undefined
    return data.pages[data.pages.length - 1]?.pagination
  }, [data])

  const totalCount = latestPagination?.total_rows ?? items.length

  const sentinelRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    enabled: !!hasNextPage && !isFetchingNextPage,
    rootRef,
  })

  return {
    ...infiniteQuery,
    items,
    pagination: latestPagination,
    totalCount,
    sentinelRef,
  }
}
