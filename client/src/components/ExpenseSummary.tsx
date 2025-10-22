'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpenseSummary } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ExpenseSummaryCardProps {
  summary: ExpenseSummary | null;
  loading?: boolean;
}

export function ExpenseSummaryCard({ summary, loading = false }: ExpenseSummaryCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading summary...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedCategories = Object.entries(summary.categories)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .slice(0, 5); // Show top 5 categories

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Total Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Total Summary</CardTitle>
          <CardDescription>Overall expense statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Transactions</span>
              <span className="text-lg font-semibold">{summary.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average per Transaction</span>
              <span className="text-lg font-semibold">
                {formatCurrency(summary.count > 0 ? summary.total / summary.count : 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Breakdown by expense category</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatCurrency(data.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{data.count} transaction{data.count !== 1 ? 's' : ''}</span>
                    <span>{((data.amount / summary.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(data.amount / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              No categories found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}