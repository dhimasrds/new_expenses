export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ExpenseSummary {
  total: number;
  totalExpenses?: number;
  totalTransactions?: number;
  count: number;
  categories: {
    [key: string]: {
      amount: number;
      count: number;
    };
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}