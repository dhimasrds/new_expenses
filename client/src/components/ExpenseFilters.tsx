'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExpenseFilters } from '@/lib/types';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { formatDateForInput } from '@/lib/utils';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onReset: () => void;
}

export function ExpenseFiltersCard({ filters, onFiltersChange, onReset }: ExpenseFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ExpenseFilters>(filters);

  const handleFilterChange = (field: keyof ExpenseFilters, value: string) => {
    const newFilters = { ...localFilters, [field]: value === 'all' || !value ? undefined : value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: ExpenseFilters = {};
    setLocalFilters(emptyFilters);
    onReset();
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white">Filters</CardTitle>
        <CardDescription className="text-gray-400">Filter your expenses by category, date, or search term</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category-filter" className="text-gray-200">Category</Label>
            <Select
              value={localFilters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-filter" className="text-gray-200">Search</Label>
            <Input
              id="search-filter"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search descriptions..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-from" className="text-gray-200">From Date</Label>
            <Input
              id="date-from"
              type="date"
              value={localFilters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to" className="text-gray-200">To Date</Label>
            <Input
              id="date-to"
              type="date"
              value={localFilters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <div className="flex gap-2">
          <Button 
            onClick={handleApplyFilters} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}