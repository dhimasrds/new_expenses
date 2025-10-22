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
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter your expenses by category, date, or search term</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={localFilters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-filter">Search</Label>
            <Input
              id="search-filter"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search descriptions..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-from">From Date</Label>
            <Input
              id="date-from"
              type="date"
              value={localFilters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to">To Date</Label>
            <Input
              id="date-to"
              type="date"
              value={localFilters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}