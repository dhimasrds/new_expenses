import { Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary, ApiResponse, PaginatedResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ExpenseAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getExpenses(filters?: ExpenseFilters, page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await this.request<{ expenses: Expense[], total: number }>(`/api/expenses?${params}`);
    
    const data = response.data!;
    const expenses = data.expenses || [];
    const total = data.total || 0;
    
    return {
      data: expenses,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getExpense(id: string): Promise<Expense> {
    const response = await this.request<Expense>(`/api/expenses/${id}`);
    return response.data!;
  }

  async createExpense(expense: ExpenseFormData): Promise<Expense> {
    const response = await this.request<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return response.data!;
  }

  async updateExpense(id: string, expense: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await this.request<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
    return response.data!;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.request(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseSummary(filters?: ExpenseFilters): Promise<ExpenseSummary> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await this.request<ExpenseSummary>(`/api/expenses/summary?${params}`);
    
    return response.data!;
  }
}

export const expenseAPI = new ExpenseAPI();