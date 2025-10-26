'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Logo } from '@/components/common/Logo';
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseSummary } from '@/hooks/useExpenseSummary';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseFilters, ExpenseFormData } from '@/lib/types';
import { expenseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { LogOut, Plus, Home, Mail } from 'lucide-react';
import { BudgetAnalyticsHub } from '@/components/dashboard/BudgetAnalyticsHub';
import { TopCategories } from '@/components/dashboard/TopCategories';
import { MonthlySpendingChart } from '@/components/dashboard/MonthlySpendingChart';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { RecentExpensesTable } from '@/components/dashboard/RecentExpensesTable';

export default function DashboardPage() {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const { expenses, pagination, loading, error, refetch } = useExpenses(filters, currentPage, 10);
  const { summary, loading: summaryLoading } = useExpenseSummary(filters);

  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
          <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
          <p className="text-gray-400 mb-4">Please login to access the dashboard.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster />
      
      {/* Header Section */}
      <header className="bg-slate-900 border-b border-slate-700 h-20">
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-white">Expense Tracker</h1>
                <p className="text-sm text-gray-400">Track and manage your expenses</p>
              </div>
            </div>

            {/* Center: Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-white">
                Welcome back, {user?.name || 'Demo User'}!
              </h2>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{user?.email || 'demo@example.com'}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Expense</DialogTitle>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto p-6 space-y-6">
        {/* Top Section: Budget Analytics + Top Categories */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetAnalyticsHub summary={summary} loading={summaryLoading} />
          </div>
          <div className="lg:col-span-1">
            <TopCategories expenses={expenses} />
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <MonthlySpendingChart expenses={expenses} />

        {/* Filters Section */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Recent Expenses Table */}
        <RecentExpensesTable
          expenses={expenses}
          loading={loading}
          error={error}
          onRefresh={refetch}
        />
      </main>
    </div>
  );
}