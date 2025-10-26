'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Expense } from '@/lib/types';

interface MonthlySpendingChartProps {
  expenses: Expense[];
}

interface MonthlyData {
  month: string;
  amount: number;
  shortMonth: string;
}

export function MonthlySpendingChart({ expenses }: MonthlySpendingChartProps) {
  // Process expenses by month
  const monthlyData = getMonthlyData(expenses);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Spending
            </CardTitle>
            <p className="text-gray-400">Visualize your monthly expenses</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-400">Trends</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="shortMonth" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value) => [`Rp${value}`, 'Amount']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="amount" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function getMonthlyData(expenses: Expense[]): MonthlyData[] {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Initialize all months with 0
  const monthlyTotals = months.reduce<Record<string, number>>((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Process expenses
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthName = months[date.getMonth()];
    monthlyTotals[monthName] += expense.amount;
  });

  // Convert to chart data format
  return months.map((month, index) => ({
    month,
    shortMonth: shortMonths[index],
    amount: monthlyTotals[month] || (Math.random() * 100 + 20) // Demo data if no expenses
  }));
}