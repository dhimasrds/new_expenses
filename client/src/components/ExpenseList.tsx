'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ExpenseForm } from './ExpenseForm';
import { expenseAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ExpenseListProps {
  expenses: Expense[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function ExpenseList({ expenses, loading = false, onRefresh }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (data: any) => {
    if (!editingExpense) return;

    try {
      setUpdateLoading(true);
      await expenseAPI.updateExpense(editingExpense.id, data);
      toast.success('Expense updated successfully');
      setEditingExpense(null);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to update expense');
      console.error('Update error:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      setDeleteLoading(id);
      await expenseAPI.deleteExpense(id);
      toast.success('Expense deleted successfully');
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-400">Loading expenses...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-400">No expenses found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Expenses</CardTitle>
          <CardDescription className="text-gray-400">Your recent expense transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-right text-gray-300">Amount</TableHead>
                <TableHead className="text-right text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-gray-300">{formatDate(expense.date)}</TableCell>
                  <TableCell className="font-medium text-white">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-700 text-gray-300 border-slate-600">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-white">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleteLoading === expense.id}
                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                      >
                        {deleteLoading === expense.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent className="max-w-md bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialData={{
                amount: editingExpense.amount,
                description: editingExpense.description,
                category: editingExpense.category,
                date: editingExpense.date,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingExpense(null)}
              loading={updateLoading}
              title=""
              description=""
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}