'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { Expense } from '@/lib/types';

interface RecentExpensesTableProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const categoryColors: Record<string, string> = {
  Bills: 'bg-orange-500',
  Work: 'bg-blue-500',
  Shopping: 'bg-orange-600',
  Transport: 'bg-red-500',
  Health: 'bg-green-500',
  Food: 'bg-purple-500',
  Entertainment: 'bg-pink-500',
  Other: 'bg-gray-500'
};

export function RecentExpensesTable({ expenses, loading, error, onRefresh }: RecentExpensesTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.Other;
  };

  // Demo data if no expenses
  const demoExpenses = [
    { id: 1, date: '2024-10-22', description: 'Morning Coffee', category: 'Food', amount: 5 },
    { id: 2, date: '2024-10-22', description: 'Lunch Meeting', category: 'Food', amount: 26 },
    { id: 3, date: '2024-10-21', description: 'Gas Station', category: 'Transport', amount: 45 },
    { id: 4, date: '2024-10-21', description: 'Grocery Shopping', category: 'Shopping', amount: 78 },
    { id: 5, date: '2024-10-20', description: 'Electricity Bill', category: 'Bills', amount: 125 }
  ];

  const displayExpenses = expenses.length > 0 ? expenses : demoExpenses;

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Recent Expenses</CardTitle>
            <p className="text-gray-400">Your recent expense transactions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/50 border border-red-700/50 rounded-lg p-4 mb-4">
            <p className="text-red-300 text-sm">Error: {error}</p>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-gray-400 font-semibold">DATE</TableHead>
                <TableHead className="text-gray-400 font-semibold">DESCRIPTION</TableHead>
                <TableHead className="text-gray-400 font-semibold">CATEGORY</TableHead>
                <TableHead className="text-gray-400 font-semibold">AMOUNT</TableHead>
                <TableHead className="text-gray-400 font-semibold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-gray-300">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryColor(expense.category)} text-white border-0`}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 font-semibold">
                    Rp{expense.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {displayExpenses.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">No expenses found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}