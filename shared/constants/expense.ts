export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Business',
  'Personal Care',
  'Gifts & Donations',
  'Investments',
  'Other'
] as const;

export const DEFAULT_CURRENCY = 'IDR';

export const DATE_FORMATS = {
  display: 'dd MMM yyyy',
  input: 'yyyy-MM-dd',
  api: 'yyyy-MM-dd',
} as const;

export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
} as const;

export const API_ENDPOINTS = {
  expenses: '/api/expenses',
  summary: '/api/expenses/summary',
} as const;