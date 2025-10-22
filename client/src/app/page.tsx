'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseFiltersCard } from '@/components/ExpenseFilters';
import { ExpenseSummaryCard } from '@/components/ExpenseSummary';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseSummary } from '@/hooks/useExpenseSummary';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseFilters, ExpenseFormData } from '@/lib/types';
import { expenseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const { expenses, pagination, loading, error, refetch } = useExpenses(filters, currentPage, 10);
  const { summary, loading: summaryLoading } = useExpenseSummary(filters);

  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      setAddLoading(true);
      await expenseAPI.createExpense(data);
      toast.success('Expense added successfully');
      setShowAddDialog(false);
      refetch();
    } catch (error) {
      toast.error('Failed to add expense');
      console.error('Add error:', error);
    } finally {
      setAddLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
              <p className="text-muted-foreground">Track and manage your expenses</p>
              {isAuthenticated && user && (
                <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}!</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
                  <Button variant="outline" onClick={() => {
                    logout();
                    toast.success('Logged out successfully');
                  }}>
                    Logout
                  </Button>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg">Add New Expense</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                      </DialogHeader>
                      <ExpenseForm
                        onSubmit={handleAddExpense}
                        onCancel={() => setShowAddDialog(false)}
                        loading={addLoading}
                        title=""
                        description=""
                      />
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? (
          <div className="space-y-8">
            {/* Summary Section */}
            <ExpenseSummaryCard summary={summary} loading={summaryLoading} />

            {/* Filters Section */}
            <ExpenseFiltersCard
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-700 text-sm">
                  Error loading expenses: {error}
                </div>
              </div>
            )}

            {/* Expenses List */}
            <ExpenseList
              expenses={expenses}
              loading={loading}
              onRefresh={refetch}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
                
                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Expense Tracker</h2>
              <p className="text-muted-foreground mb-8">
                Track and manage your personal expenses with ease. Please login or create an account to get started.
              </p>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
