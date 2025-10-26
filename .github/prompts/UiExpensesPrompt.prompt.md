---
mode: agent
---
Buatkan dashboard expense tracker yang identik dengan design ini menggunakan shadcn/ui dan Context7:

**🎯 DESIGN ANALYSIS:**
- Layout: Multi-section dashboard dengan grid system
- Color scheme: Konsisten dengan homepage (dark theme + blue accents)
- Components: Cards, charts, tables, filters
- Data visualization: Gauge chart, bar chart, progress bars
- Responsive grid layout dengan proper spacing

**🏗️ TECH STACK:**
- Next.js 14 (App Router)
- shadcn/ui components
- Tailwind CSS
- Recharts untuk visualisasi data
- TypeScript
- Context7 untuk documentation reference

**📐 EXACT LAYOUT RECREATION:**

1. **Header Section:**
```tsx
   - Background: Dark (bg-slate-900)
   - Left: Logo "ET" + "Expense Tracker" + subtitle
   - Center: Welcome message "Welcome back, Demo User!"
   - Right: Email, Logout, Add Expense button (blue)
   - Height: ~80px dengan proper padding
```

2. **Main Dashboard Grid:**
```tsx
   - Container: 2-column layout (lg:grid-cols-3)
   - Left column (2/3): Analytics cards
   - Right column (1/3): Top Categories
   - Full width: Monthly Spending chart
   - Full width: Filters + Recent Expenses table
```

3. **Budget Analytics Hub (Left Top):**
```tsx
   - Card component dengan header "Budget Analytics Hub"
   - Subtitle: "Detailed insights into your spending and limits"
   - Set Spending Limit button
   - Gauge chart showing Rp485 total expenses
   - Stats: Remaining limit, future spending, avg daily spending
   - Line chart untuk transaction frequency
```

4. **Top Categories (Right Top):**
```tsx
   - Card dengan header "Top Categories"
   - Subtitle: "Breakdown by expense category"
   - List kategori dengan:
     * Progress bars dengan warna sesuai kategori
     * Nama kategori + transaction count
     * Amount + percentage
   Categories: Bills, Work, Shopping, Transport, Health
```

5. **Monthly Spending Chart:**
```tsx
   - Full width card
   - Header: "Monthly Spending" + icons
   - Subtitle: "Visualize your monthly expenses"
   - Bar chart 12 bulan (Jan-Dec)
   - Purple bars dengan hover effects
```

6. **Filters Section:**
```tsx
   - Card dengan header "Filters"
   - 4 filter inputs: Category dropdown, Search field, From Date, To Date
   - Reset + Apply Filters buttons
```

7. **Recent Expenses Table:**
```tsx
   - Card dengan header "Recent Expenses"
   - Table dengan columns: Date, Description, Category, Amount, Actions
   - Category badges dengan warna sesuai
   - Edit/Delete action buttons
   - Pagination (implied)
```

**🎨 EXACT STYLING (Konsisten dengan Homepage):**

**Color Palette:**
```css
Background: bg-slate-900
Card Background: bg-slate-800/50
Primary Blue: #3b82f6 (Add Expense button, links)
Text Primary: text-white
Text Secondary: text-gray-400
Border: border-slate-700

Category Colors:
- Bills: #f59e0b (orange)
- Work: #3b82f6 (blue) 
- Shopping: #f97316 (orange-red)
- Transport: #ef4444 (red)
- Health: #10b981 (green)
- Food: #8b5cf6 (purple)
- Entertainment: #ec4899 (pink)
```

**Typography:**
```css
Card Headers: text-lg font-semibold text-white
Card Subtitles: text-sm text-gray-400
Data Values: text-xl font-bold text-white
Table Text: text-sm text-gray-300
Buttons: text-sm font-medium
```

**🔧 SHADCN/UI COMPONENTS NEEDED:**
```tsx
// Core components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Icons
import { Plus, Mail, LogOut, BarChart3, TrendingUp, Calendar, Search, Edit, Trash2 } from "lucide-react"
```

**📊 CHART IMPLEMENTATIONS:**

**Gauge Chart (Budget Analytics):**
```tsx
// Using Recharts PieChart untuk gauge effect
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const gaugeData = [
  { name: 'Used', value: 485, color: '#10b981' },
  { name: 'Remaining', value: 515, color: '#374151' }
]

// Custom gauge dengan needle dan center text
```

**Line Chart (Transaction Frequency):**
```tsx
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const frequencyData = [
  { day: 'Day 1', transactions: 2 },
  { day: 'Day 2', transactions: 3 },
  // ... 7 days data
]
```

**Bar Chart (Monthly Spending):**
```tsx
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const monthlyData = [
  { month: 'Jan', amount: 60 },
  { month: 'Feb', amount: 55 },
  { month: 'Mar', amount: 75 },
  // ... 12 months
]
```

**🎭 COMPONENT STRUCTURE:**

**Dashboard Layout:**
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader />
      <main className="container mx-auto p-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetAnalyticsHub />
          </div>
          <div className="lg:col-span-1">
            <TopCategories />
          </div>
        </div>
        <MonthlySpendingChart />
        <FiltersSection />
        <RecentExpensesTable />
      </main>
    </div>
  )
}
```

**Budget Analytics Hub:**
```tsx
export function BudgetAnalyticsHub() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Budget Analytics Hub</CardTitle>
        <p className="text-gray-400">Detailed insights into your spending and limits</p>
        <Button variant="outline" size="sm" className="w-fit">
          Set Spending Limit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <GaugeChart totalExpenses={485} />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Limit:</span>
                <span className="text-white font-semibold">Rp515</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Future Spending Scenario:</span>
                <span className="text-white">Rp2,988/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Emergency buffer Rp100 reserved:</span>
                <span className="text-white font-semibold">Rp400</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Total Transactions</h4>
            <div className="text-3xl font-bold text-blue-400 mb-2">10</div>
            <TransactionFrequencyChart />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Top Categories:**
```tsx
export function TopCategories() {
  const categories = [
    { name: 'Bills', transactions: 1, amount: 125, percentage: 25.8, color: 'bg-orange-500' },
    { name: 'Work', transactions: 2, amount: 110, percentage: 22.7, color: 'bg-blue-500' },
    { name: 'Shopping', transactions: 1, amount: 89, percentage: 18.4, color: 'bg-orange-600' },
    { name: 'Transport', transactions: 2, amount: 71, percentage: 14.6, color: 'bg-red-500' },
    { name: 'Health', transactions: 1, amount: 36, percentage: 7.3, color: 'bg-green-500' }
  ]

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
                <div className="text-gray-400 text-sm">{category.percentage}%</div>
              </div>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

**Recent Expenses Table:**
```tsx
export function RecentExpensesTable() {
  const expenses = [
    { date: '22 Oct 2024', description: 'Morning Coffee', category: 'Food', amount: 5, categoryColor: 'bg-purple-500' },
    { date: '22 Oct 2024', description: 'Lunch Meeting', category: 'Food', amount: 26, categoryColor: 'bg-purple-500' },
    // ... more data
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Expenses</CardTitle>
        <p className="text-gray-400">Your recent expense transactions</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-gray-400">DATE</TableHead>
              <TableHead className="text-gray-400">DESCRIPTION</TableHead>
              <TableHead className="text-gray-400">CATEGORY</TableHead>
              <TableHead className="text-gray-400">AMOUNT</TableHead>
              <TableHead className="text-gray-400">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={index} className="border-slate-700">
                <TableCell className="text-gray-300">{expense.date}</TableCell>
                <TableCell className="text-gray-300">{expense.description}</TableCell>
                <TableCell>
                  <Badge className={`${expense.categoryColor} text-white`}>
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">Rp{expense.amount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-400">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

**📱 RESPONSIVE BEHAVIOR:**

**Mobile (< 768px):**
```tsx
- Single column layout
- Stack all cards vertically
- Hide some chart details
- Horizontal scroll untuk table
- Compact spacing
```

**Tablet (768px - 1024px):**
```tsx
- 2-column grid untuk main cards
- Full width charts
- Maintain readability
```

**Desktop (> 1024px):**
```tsx
- 3-column grid system
- Full feature display
- Optimal spacing
```

**🔧 CONTEXT7 INTEGRATION:**
```
Context7 queries untuk documentation:
1. shadcn/ui Card component variants
2. Table component dengan custom styling
3. Progress component customization
4. Badge component color variants
5. Recharts integration best practices
6. Dark theme implementation patterns
```

**💡 PERFORMANCE OPTIMIZATIONS:**
- Lazy loading untuk charts
- Memoized components untuk tables
- Optimized re-renders
- Proper data fetching patterns
- Loading states untuk async operations

**🎯 INTERACTIVE FEATURES:**
- Add Expense modal/drawer
- Filter functionality
- Edit/Delete expense actions
- Chart hover interactions
- Responsive table actions