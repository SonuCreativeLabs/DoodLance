import { useState, useEffect, useCallback } from 'react';

interface UseAdminDataOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

interface UseAdminDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

export function useAdminData<T>(
  fetcher: () => Promise<T>,
  options: UseAdminDataOptions = {}
): UseAdminDataResult<T> {
  const { autoFetch = true, refreshInterval, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher, onError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  return { data, loading, error, refetch, mutate };
}

// Pagination Hook
interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
  };
}

// Filter Hook
interface UseFiltersOptions<T> {
  initialFilters?: T;
}

export function useFilters<T extends Record<string, any>>(
  options: UseFiltersOptions<T> = {}
) {
  const { initialFilters = {} as T } = options;
  
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback((key: keyof T) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    clearFilter,
  };
}

// Combined Hook for Admin Tables
interface UseAdminTableOptions<T> {
  fetcher: (params: any) => Promise<{ data: T[]; total: number }>;
  initialFilters?: Record<string, any>;
  refreshInterval?: number;
}

export function useAdminTable<T>(options: UseAdminTableOptions<T>) {
  const { fetcher, initialFilters = {}, refreshInterval } = options;
  
  const pagination = usePagination();
  const { filters, updateFilter, resetFilters } = useFilters({ initialFilters });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDataWithParams = useCallback(async () => {
    const params = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      search: searchTerm,
      ...filters,
    };
    
    const result = await fetcher(params);
    pagination.setTotalItems(result.total);
    return result.data;
  }, [
    fetcher,
    pagination.currentPage,
    pagination.itemsPerPage,
    searchTerm,
    filters,
  ]);

  const { data, loading, error, refetch } = useAdminData(
    fetchDataWithParams,
    { refreshInterval }
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.resetPagination();
  }, [filters, searchTerm]);

  return {
    data,
    loading,
    error,
    refetch,
    pagination,
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    resetFilters,
  };
}
