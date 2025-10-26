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
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-400">Loading summary...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-400">No data available</div>
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
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Total Summary</CardTitle>
          <CardDescription className="text-gray-400">Overall expense statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Total Amount</span>
              <span className="text-2xl font-bold text-red-400">
                {formatCurrency(summary.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Total Transactions</span>
              <span className="text-lg font-semibold text-white">{summary.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Average per Transaction</span>
              <span className="text-lg font-semibold text-white">
                {formatCurrency(summary.count > 0 ? summary.total / summary.count : 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Top Categories</CardTitle>
          <CardDescription className="text-gray-400">Breakdown by expense category</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs bg-slate-700 text-gray-300 border-slate-600">
                      {category}
                    </Badge>
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(data.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{data.count} transaction{data.count !== 1 ? 's' : ''}</span>
                    <span>{((data.amount / summary.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(data.amount / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-400 py-4">
              No categories found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}