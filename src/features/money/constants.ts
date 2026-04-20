import type { CategoryConfig, CategoryTotals } from '@/features/money/types';

const EXPENSE_CATEGORY_CONFIGS: CategoryConfig[] = [
  { category: 'medical', label: '醫療支出', color: 'bg-primary-default' },
  { category: 'food', label: '飲食支出', color: 'bg-neutral-800' },
  { category: 'traffic', label: '交通費用', color: 'bg-neutral-400' },
  { category: 'other', label: '生活雜支', color: 'bg-neutral-50' },
];

const INITIAL_CATEGORY_TOTALS: CategoryTotals = {
  medical: 0,
  food: 0,
  traffic: 0,
  other: 0,
};

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  EXPENSE_CATEGORY_CONFIGS.map(({ category, label }) => [category, label]),
);

const getCategoryLabel = (category: string) =>
  CATEGORY_LABEL[category] ?? category;

export { EXPENSE_CATEGORY_CONFIGS, INITIAL_CATEGORY_TOTALS, getCategoryLabel };
