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
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
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

  const handleDelete = async (id: number) => {
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading expenses...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">No expenses found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your recent expense transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleteLoading === expense.id}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
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