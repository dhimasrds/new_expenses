'use client';

import { useState, useEffect } from 'react';
import { expenseAPI } from '@/lib/api';
import { ExpenseSummary, ExpenseFilters } from '@/lib/types';

export function useExpenseSummary(filters?: ExpenseFilters) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);
        const result = await expenseAPI.getExpenseSummary(filters);
        setSummary(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [filters]);

  return {
    summary,
    loading,
    error,
  };
}