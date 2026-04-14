import { useState } from 'react';

import { parseISO } from 'date-fns';

import FilterDropdownButton, {
  type FilterOption,
} from '@/components/common/FilterDropdownButton';
import type { ExpenseItem } from '@/features/money/types';

import useActivedMoneyTab from '../hooks/useActivedMoneyTab';

import EntryCard from './EntryCard';

type SplitFilter = 'all' | 'pending' | 'settled' | 'none';

const SPLIT_FILTER_OPTIONS: FilterOption<SplitFilter>[] = [
  { label: '全部顯示', value: 'all' },
  { label: '僅顯示需分帳', value: 'pending' },
  { label: '僅顯示已分帳', value: 'settled' },
  { label: '僅顯示無需分帳', value: 'none' },
];

type CardsListProps = {
  items: ExpenseItem[];
};

const filterItems = (items: ExpenseItem[], filter: SplitFilter) => {
  if (filter === 'all') return items;
  return items.filter((item) => item.splitStatus === filter);
};

type DateGroup = { date: string; items: ExpenseItem[] };

const formatDateLabel = (date: string) => date.replace(/-/g, '.');

const groupByDate = (items: ExpenseItem[]): DateGroup[] => {
  const sorted = [...items].sort(
    (a, b) =>
      parseISO(b.expenseDate.replace('Z', '')).getTime() -
      parseISO(a.expenseDate.replace('Z', '')).getTime(),
  );
  return sorted.reduce<DateGroup[]>((acc, item) => {
    const dateKey = item.expenseDate.slice(0, 10);
    const last = acc[acc.length - 1];
    if (last?.date === dateKey) {
      last.items.push(item);
    } else {
      acc.push({ date: dateKey, items: [item] });
    }
    return acc;
  }, []);
};

function CardsList({ items }: CardsListProps) {
  const [filter, setFilter] = useState<SplitFilter>('all');
  const { activeTab } = useActivedMoneyTab();
  const filteredItems = filterItems(items, filter);
  const groups = groupByDate(filteredItems);

  const isDailyTab = activeTab === 'daily';
  const isMonthlyTab = activeTab === 'monthly';

  return (
    <section className="px-6 py-5">
      <div className="mb-5 flex items-center justify-between">
        {isDailyTab && (
          <h2 className="font-heading-md text-neutral-900">當日花費</h2>
        )}
        {isMonthlyTab && (
          <h2 className="font-heading-md text-neutral-900">當月花費</h2>
        )}

        <FilterDropdownButton
          className="h-8 w-fit"
          buttonClassName="bg-neutral-100 w-35.25"
          menuClassName="bg-neutral-100"
          value={filter}
          options={SPLIT_FILTER_OPTIONS}
          onChange={setFilter}
        />
      </div>

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.date} className="flex flex-col gap-3">
            {isMonthlyTab && (
              <p className="font-label-md text-neutral-600">
                {formatDateLabel(group.date)}
              </p>
            )}
            {group.items.map((item) => (
              <EntryCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardsList;
