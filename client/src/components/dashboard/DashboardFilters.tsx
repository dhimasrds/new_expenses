'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search } from 'lucide-react';
import { ExpenseFilters } from '@/lib/types';

interface DashboardFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onReset: () => void;
}

const categories = [
  'All Categories',
  'Bills',
  'Work', 
  'Shopping',
  'Transport',
  'Health',
  'Food',
  'Entertainment',
  'Other'
];

export function DashboardFilters({ filters, onFiltersChange, onReset }: DashboardFiltersProps) {
  const handleCategoryChange = (value: string) => {
    const category = value === 'All Categories' ? undefined : value;
    onFiltersChange({ ...filters, category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value || undefined });
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateFrom: e.target.value || undefined });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateTo: e.target.value || undefined });
  };

  const formatDateForInput = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Filters</CardTitle>
        <p className="text-gray-400">Filter and search your expenses</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <Select 
              value={filters.category || 'All Categories'} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="text-white hover:bg-slate-600"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search expenses..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* From Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={formatDateForInput(filters.dateFrom)}
                onChange={handleFromDateChange}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* To Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={formatDateForInput(filters.dateTo)}
                onChange={handleToDateChange}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            Reset Filters
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}