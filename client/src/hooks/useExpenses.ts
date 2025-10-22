'use client';

import { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from '@/lib/api';
import { Expense, ExpenseFilters, PaginatedResponse } from '@/lib/types';

export function useExpenses(filters?: ExpenseFilters, page = 1, limit = 10) {
  const [data, setData] = useState<PaginatedResponse<Expense> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await expenseAPI.getExpenses(filters, page, limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchExpenses,
  };
}