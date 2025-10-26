'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';

interface BudgetAnalyticsHubProps {
  summary: any;
  loading: boolean;
}

// Custom Gauge Chart Component
function GaugeChart({ totalExpenses, limit = 1000 }: { totalExpenses: number; limit?: number }) {
  const percentage = Math.min((totalExpenses / limit) * 100, 100);
  const remaining = Math.max(limit - totalExpenses, 0);
  
  const data = [
    { name: 'Used', value: percentage, color: '#10b981' },
    { name: 'Remaining', value: 100 - percentage, color: '#334155' }
  ];

  return (
    <div className="relative w-48 h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-white">Rp{totalExpenses}</div>
        <div className="text-sm text-gray-400">Total Expenses</div>
      </div>
    </div>
  );
}

// Transaction Frequency Chart
function TransactionFrequencyChart() {
  const data = [
    { day: 'Day 1', transactions: 2 },
    { day: 'Day 2', transactions: 3 },
    { day: 'Day 3', transactions: 1 },
    { day: 'Day 4', transactions: 4 },
    { day: 'Day 5', transactions: 2 },
    { day: 'Day 6', transactions: 1 },
    { day: 'Day 7', transactions: 3 }
  ];

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis hide />
          <Line 
            type="monotone" 
            dataKey="transactions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BudgetAnalyticsHub({ summary, loading }: BudgetAnalyticsHubProps) {
  const totalExpenses = summary?.totalExpenses || 485;
  const limit = 1000;
  const remaining = limit - totalExpenses;
  const futureSpending = remaining > 0 ? remaining / 30 : 0; // Assume 30 days
  const emergencyBuffer = 100;
  const availableAfterBuffer = Math.max(remaining - emergencyBuffer, 0);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="h-48 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Budget Analytics Hub</CardTitle>
        <p className="text-gray-400">Detailed insights into your spending and limits</p>
        <Button variant="outline" size="sm" className="w-fit border-slate-600 text-gray-300 hover:bg-slate-700">
          Set Spending Limit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gauge Chart Section */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart totalExpenses={totalExpenses} limit={limit} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Limit:</span>
                <span className="text-white font-semibold">Rp{remaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Future Spending Scenario:</span>
                <span className="text-white">Rp{futureSpending.toFixed(0)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Emergency buffer Rp{emergencyBuffer} reserved:</span>
                <span className="text-white font-semibold">Rp{availableAfterBuffer}</span>
              </div>
            </div>
          </div>

          {/* Transaction Frequency Section */}
          <div>
            <h4 className="text-white font-medium mb-2">Total Transactions</h4>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {summary?.totalTransactions || 10}
            </div>
            <p className="text-sm text-gray-400 mb-4">Transaction frequency over the week</p>
            <TransactionFrequencyChart />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}