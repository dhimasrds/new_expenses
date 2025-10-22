# 🎨 Expense Tracker UI Development Guide dengan Shadcn UI

## 🎯 Tujuan UI Development
Membuat interface yang clean, modern, dan user-friendly untuk aplikasi expense tracker menggunakan Shadcn UI dengan fokus pada:
- **User Experience (UX)** yang intuitif
- **Responsive Design** untuk mobile dan desktop
- **Accessibility** yang baik
- **Performance** yang optimal
- **Consistency** dalam design system

## 🛠️ Tech Stack untuk Frontend

```typescript
// Core Framework
- Next.js 14+ (App Router)
- React 18+
- TypeScript

// UI & Styling
- Shadcn UI (components)
- Tailwind CSS (styling)
- Lucide React (icons)
- React Hook Form (form handling)
- Zod (validation)

// State Management & Data
- Supabase Client (backend integration)
- TanStack Query (server state)
- Zustand (client state)

// Additional Libraries
- date-fns (date manipulation)
- Chart.js atau Recharts (data visualization)
- React Hot Toast (notifications)
```

## 📋 UI Components Structure

### 1. **Authentication Components**

#### Login Form Component
```typescript
// components/auth/login-form.tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  // Form implementation with validation
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your expense tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john@example.com" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

#### Register Form Component
```typescript
// components/auth/register-form.tsx
// Similar structure dengan additional fields untuk registration
```

### 2. **Expense Management Components**

#### Expense List Component
```typescript
// components/expenses/expense-list.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expenseId: string) => void
  isLoading?: boolean
}

const ExpenseList = ({ expenses, onEdit, onDelete, isLoading }: ExpenseListProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      Food: "bg-orange-100 text-orange-800",
      Transport: "bg-blue-100 text-blue-800",
      Work: "bg-green-100 text-green-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Health: "bg-red-100 text-red-800",
      Shopping: "bg-pink-100 text-pink-800",
      Bills: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800"
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return <ExpenseListSkeleton />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {expense.description}
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(expense.category)}>
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">
                ${expense.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

#### Add/Edit Expense Modal
```typescript
// components/expenses/expense-modal.tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface ExpenseModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  expense?: Expense | null
  onSubmit: (data: ExpenseFormData) => Promise<void>
  isLoading?: boolean
}

const ExpenseModal = ({ isOpen, onOpenChange, expense, onSubmit, isLoading }: ExpenseModalProps) => {
  const categories = [
    "Food", "Transport", "Work", "Entertainment", 
    "Health", "Shopping", "Bills", "Other"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogDescription>
            {expense 
              ? 'Make changes to your expense here.' 
              : 'Add a new expense to your tracker.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Coffee with client" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0.00" 
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Select */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {expense ? 'Update' : 'Add'} Expense
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### 3. **Dashboard & Summary Components**

#### Dashboard Stats Cards
```typescript
// components/dashboard/stats-cards.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react"

interface StatsCardsProps {
  totalExpenses: number
  monthlyTotal: number
  averageExpense: number
  categoriesCount: number
  isLoading?: boolean
}

const StatsCards = ({ totalExpenses, monthlyTotal, averageExpense, categoriesCount, isLoading }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      description: "All time expenses",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "This Month",
      value: `$${monthlyTotal.toFixed(2)}`,
      description: "Current month spending",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Average Expense",
      value: `$${averageExpense.toFixed(2)}`,
      description: "Per transaction",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Categories Used",
      value: categoriesCount.toString(),
      description: "Different categories",
      icon: PieChart,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

#### Expense Filter Component
```typescript
// components/expenses/expense-filters.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"

interface ExpenseFiltersProps {
  filters: {
    category?: string
    dateFrom?: Date
    dateTo?: Date
    search?: string
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

const ExpenseFilters = ({ filters, onFiltersChange, onClearFilters }: ExpenseFiltersProps) => {
  const categories = [
    "Food", "Transport", "Work", "Entertainment", 
    "Health", "Shopping", "Bills", "Other"
  ]

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo || filters.search

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search expenses..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Category Filter */}
      <Select
        value={filters.category || "all"}
        onValueChange={(value) => 
          onFiltersChange({ 
            ...filters, 
            category: value === "all" ? undefined : value 
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px]">
              {filters.dateFrom ? format(filters.dateFrom, "MMM dd") : "From"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px]">
              {filters.dateTo ? format(filters.dateTo, "MMM dd") : "To"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}
```

## 📱 Layout & Navigation

### Main Layout Component
```typescript
// components/layout/main-layout.tsx
import { SidebarNav } from "./sidebar-nav"
import { TopNav } from "./top-nav"
import { Toaster } from "@/components/ui/toaster"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <TopNav />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
```

### Sidebar Navigation
```typescript
// components/layout/sidebar-nav.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Home, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut,
  Plus
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const SidebarNav = () => {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Receipt className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">
          ExpenseTracker
        </span>
      </div>

      {/* Add Expense Button */}
      <div className="px-6 py-4">
        <Button className="w-full" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## 🎨 UI/UX Best Practices

### 1. **Loading States**
```typescript
// components/ui/loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export const ExpenseListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
)
```

### 2. **Empty States**
```typescript
// components/ui/empty-state.tsx
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="text-center py-12">
    <Receipt className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
    {action && (
      <div className="mt-6">
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      </div>
    )}
  </div>
)
```

### 3. **Error Handling**
```typescript
// components/ui/error-boundary.tsx
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

const ErrorBoundary = ({ error, reset }: ErrorBoundaryProps) => (
  <div className="text-center py-12">
    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      Something went wrong!
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {error.message}
    </p>
    <div className="mt-6">
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  </div>
)
```

### 4. **Responsive Design Patterns**
```typescript
// Responsive Table/Card Layout
const ExpenseListResponsive = ({ expenses }: { expenses: Expense[] }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <ExpenseTable expenses={expenses} />
      </div>
      
      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </>
  )
}
```

## 🔗 Integration dengan Supabase

### 1. **Supabase Client Setup**
```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Types
export interface Expense {
  id: string
  user_id: string
  description: string
  amount: number
  category: string
  date: string
  created_at: string
  updated_at: string
}
```

### 2. **Custom Hooks untuk Data Management**
```typescript
// hooks/use-expenses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      
      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      const { data, error } = await query
      
      if (error) throw error
      return data
    }
  })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (expense: CreateExpenseData) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast({
        title: "Success",
        description: "Expense created successfully."
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
```

### 3. **Authentication Hook**
```typescript
// hooks/use-auth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/auth-helpers-nextjs'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signOut }
}
```

## 📊 Data Visualization Components

### Expense Chart Component
```typescript
// components/analytics/expense-chart.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ExpenseChartProps {
  data: Array<{
    category: string
    amount: number
    count: number
  }>
}

const ExpenseChart = ({ data }: ExpenseChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Expenses by Category</CardTitle>
      <CardDescription>
        Your spending breakdown across different categories
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [`$${value}`, 'Amount']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
```

## 🧪 Testing Strategy untuk UI Components

### 1. **Component Testing dengan Jest & Testing Library**
```typescript
// __tests__/components/expense-modal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExpenseModal } from '@/components/expenses/expense-modal'

describe('ExpenseModal', () => {
  const mockOnSubmit = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when open', () => {
    render(
      <ExpenseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Add New Expense')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Coffee with client')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <ExpenseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    const submitButton = screen.getByText('Add Expense')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })
})
```

### 2. **Storybook untuk Component Development**
```typescript
// stories/ExpenseModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ExpenseModal } from '@/components/expenses/expense-modal'

const meta: Meta<typeof ExpenseModal> = {
  title: 'Components/ExpenseModal',
  component: ExpenseModal,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    onOpenChange: () => {},
    onSubmit: async () => {},
  },
}

export const EditMode: Story = {
  args: {
    isOpen: true,
    expense: {
      id: 'exp_123',
      description: 'Coffee with client',
      amount: 5.75,
      category: 'Food',
      date: '2025-10-28T10:00:00.000Z'
    },
    onOpenChange: () => {},
    onSubmit: async () => {},
  },
}
```

## 📱 Progressive Web App (PWA) Setup

### PWA Configuration
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  reactStrictMode: true,
})

// public/manifest.json
{
  "name": "Expense Tracker",
  "short_name": "ExpenseTracker",
  "description": "Track your expenses easily",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🎯 Performance Optimization

### 1. **Code Splitting & Lazy Loading**
```typescript
// Lazy load heavy components
const ExpenseChart = lazy(() => import('@/components/analytics/expense-chart'))
const ExpenseExport = lazy(() => import('@/components/expenses/expense-export'))

// Usage
<Suspense fallback={<ChartSkeleton />}>
  <ExpenseChart data={chartData} />
</Suspense>
```

### 2. **Image Optimization**
```typescript
// components/ui/optimized-image.tsx
import Image from 'next/image'

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    quality={75}
    {...props}
  />
)
```

## 📝 Checklist untuk UI Development

### ✅ Setup & Configuration
- [ ] Next.js project dengan App Router
- [ ] Shadcn UI components installed
- [ ] Tailwind CSS configured
- [ ] TypeScript setup
- [ ] ESLint & Prettier configured

### ✅ Core Components
- [ ] Authentication forms (Login/Register)
- [ ] Expense list dengan filtering
- [ ] Add/Edit expense modal
- [ ] Dashboard dengan summary cards
- [ ] Navigation & layout components

### ✅ UX/UI Features
- [ ] Loading states untuk semua async operations
- [ ] Empty states untuk data kosong
- [ ] Error boundaries dan error handling
- [ ] Toast notifications untuk feedback
- [ ] Responsive design (mobile-first)

### ✅ Data Integration
- [ ] Supabase client setup
- [ ] Custom hooks untuk data fetching
- [ ] Form validation dengan Zod
- [ ] Optimistic updates untuk better UX

### ✅ Performance & Accessibility
- [ ] Code splitting untuk large components
- [ ] Image optimization
- [ ] Proper semantic HTML
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility

### ✅ Testing & Quality
- [ ] Unit tests untuk components
- [ ] Integration tests untuk forms
- [ ] Storybook untuk component library
- [ ] E2E tests untuk critical paths

---

**🎉 Happy UI Development!**

Dengan guide ini, Anda akan bisa membuat interface yang professional, user-friendly, dan scalable untuk expense tracker application!
