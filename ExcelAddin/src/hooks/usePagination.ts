import { useState, useCallback } from 'react'

export interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
}

export const usePagination = (initialPageSize = 10) => {
  const [state, setState] = useState<PaginationState>({
    currentPage: 1,
    pageSize: initialPageSize,
    totalItems: 0,
  })

  const goToPage = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(1, page),
    }))
  }, [])

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }))
  }, [])

  const prevPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1),
    }))
  }, [])

  const setPageSize = useCallback((size: number) => {
    setState((prev) => ({
      ...prev,
      pageSize: size,
      currentPage: 1,
    }))
  }, [])

  const setTotalItems = useCallback((total: number) => {
    setState((prev) => ({
      ...prev,
      totalItems: total,
    }))
  }, [])

  const totalPages = Math.ceil(state.totalItems / state.pageSize)

  return {
    ...state,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setTotalItems,
  }
}
