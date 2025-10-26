'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/lib/types';

interface TopCategoriesProps {
  expenses: Expense[];
}

interface CategoryData {
  name: string;
  transactions: number;
  amount: number;
  percentage: number;
  color: string;
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

const colorMap: Record<string, string> = {
  'bg-orange-500': '#f97316',
  'bg-blue-500': '#3b82f6',
  'bg-orange-600': '#ea580c',
  'bg-red-500': '#ef4444',
  'bg-green-500': '#10b981',
  'bg-purple-500': '#8b5cf6',
  'bg-pink-500': '#ec4899',
  'bg-gray-500': '#6b7280'
};

function getColorHex(bgClass: string): string {
  return colorMap[bgClass] || '#6b7280';
}

export function TopCategories({ expenses }: TopCategoriesProps) {
  // Process expenses to get category data
  const categoryData = expenses.reduce<Record<string, { amount: number; count: number }>>((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = { amount: 0, count: 0 };
    }
    acc[category].amount += expense.amount;
    acc[category].count += 1;
    return acc;
  }, {});

  // Calculate total amount for percentages
  const totalAmount = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0);

  // Convert to array and sort by amount
  const categories: CategoryData[] = Object.entries(categoryData)
    .map(([name, data]) => ({
      name,
      transactions: data.count,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      color: categoryColors[name] || categoryColors.Other
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 categories

  // Default data if no expenses
  if (categories.length === 0) {
    const defaultCategories: CategoryData[] = [
      { name: 'Bills', transactions: 1, amount: 125, percentage: 25.8, color: categoryColors.Bills },
      { name: 'Work', transactions: 2, amount: 110, percentage: 22.7, color: categoryColors.Work },
      { name: 'Shopping', transactions: 1, amount: 89, percentage: 18.4, color: categoryColors.Shopping },
      { name: 'Transport', transactions: 2, amount: 71, percentage: 14.6, color: categoryColors.Transport },
      { name: 'Health', transactions: 1, amount: 36, percentage: 7.3, color: categoryColors.Health }
    ];
    return <TopCategoriesContent categories={defaultCategories} />;
  }

  return <TopCategoriesContent categories={categories} />;
}

function TopCategoriesContent({ categories }: { categories: CategoryData[] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Top Categories</CardTitle>
        <p className="text-gray-400">Breakdown by expense category</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-white font-medium">{category.name}</span>
                <span className="text-gray-400 text-sm ml-2">
                  {category.transactions} transaction{category.transactions > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">Rp{category.amount}</div>
                <div className="text-gray-400 text-sm">{category.percentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${category.percentage}%`,
                  backgroundColor: getColorHex(category.color)
                }}
              />
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}