import { useState } from 'react';

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

function CardsList({ items }: CardsListProps) {
  const [filter, setFilter] = useState<SplitFilter>('all');
  const filteredItems = filterItems(items, filter);
  const { activeTab } = useActivedMoneyTab();

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

      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => (
          <EntryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default CardsList;
