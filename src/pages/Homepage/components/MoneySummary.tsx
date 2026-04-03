import { useState } from 'react';

import { ArrowLeft, ArrowUpRight, ChevronDown, Plus } from 'lucide-react';

import { CardLabelSecondary } from '@/components/common/CardLabel';
import {
  CircleButtonPrimary,
  CircleButtonSecondary,
} from '@/components/common/CircleIButton';
import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';

type MoneySummaryProps = {
  onSwitchToDiary: () => void;
};

function MoneySummary({ onSwitchToDiary }: MoneySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { expenses } = useExpenses();

  const firstItems = expenses.slice(0, 2);
  const remainingCount = expenses.length - 2;

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">今日帳目</h2>
        <CircleButtonPrimary
          size="md"
          aria-label="切換回今日日誌"
          onClick={onSwitchToDiary}
          className="bg-neutral-50 text-neutral-900"
        >
          <ArrowLeft />
        </CircleButtonPrimary>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        <div className="mb-4 flex items-center justify-between">
          <CardLabelSecondary>今日帳目</CardLabelSecondary>
          <div className="flex items-center gap-3">
            <CircleButtonSecondary size="md" aria-label="跳轉帳目">
              <ArrowUpRight />
            </CircleButtonSecondary>
            <CircleButtonPrimary size="md" aria-label="新增帳目">
              <Plus />
            </CircleButtonPrimary>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {firstItems.map((item) => (
            <EntryCard key={item.id} item={item} />
          ))}

          {isExpanded &&
            expenses
              .slice(2)
              .map((item) => <EntryCard key={item.id} item={item} />)}
        </div>

        {remainingCount > 0 && (
          <button
            type="button"
            className="font-label-md mt-3 flex w-full items-center justify-center gap-1 py-2 text-neutral-700"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? '收起' : `查看其他 ${remainingCount} 筆帳目`}
            <ChevronDown
              className={`size-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>
    </section>
  );
}

export default MoneySummary;
