import { Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary, ApiResponse, PaginatedResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

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

    const response = await this.request(`/api/v1/expenses/demo?${params}`);
    
    // Transform demo response to expected format
    const data = response as any;
    const expenses = data.expenses || [];
    
    return {
      data: expenses,
      pagination: {
        page: page,
        limit: limit,
        total: expenses.length,
        totalPages: Math.ceil(expenses.length / limit)
      }
    };
  }

  async getExpense(id: number): Promise<Expense> {
    const response = await this.request<Expense>(`/api/v1/expenses/${id}`);
    return response.data!;
  }

  async createExpense(expense: ExpenseFormData): Promise<Expense> {
    const response = await this.request<Expense>('/api/v1/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return response.data!;
  }

  async updateExpense(id: number, expense: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await this.request<Expense>(`/api/v1/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
    return response.data!;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.request(`/api/v1/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseSummary(filters?: ExpenseFilters): Promise<ExpenseSummary> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await this.request(`/api/v1/expenses/demo?${params}`);
    
    // Extract summary data from demo response
    const data = response as any;
    const expenses = data.expenses || [];
    
    if (Array.isArray(expenses)) {
      const total = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      const count = expenses.length;
      const categories = expenses.reduce((acc: any, expense: any) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = { amount: 0, count: 0 };
        }
        acc[category].amount += expense.amount;
        acc[category].count += 1;
        return acc;
      }, {});
      
      return { total, count, categories };
    }
    
    return { total: 0, count: 0, categories: {} };
  }
}

export const expenseAPI = new ExpenseAPI();