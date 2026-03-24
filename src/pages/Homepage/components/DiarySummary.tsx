import { useState } from 'react';

import { ArrowRight, ArrowUpRight, ChevronDown, Plus } from 'lucide-react';

import { CardLabelPrimary } from '@/components/common/CardLabel';
import {
  CircleButtonPrimary,
  CircleButtonSecondary,
} from '@/components/common/CircleIButton';
import DairyCard from '@/components/common/DairyCard';
import mockDiaryCards from '@/pages/Calendar/mockDiaryCards';

function getStatusText(checked?: boolean) {
  if (checked === true) return '已完成';
  if (checked === false) return '未完成';
  return '進行中';
}

function DiarySummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstCard = mockDiaryCards[0];
  const remainingCount = mockDiaryCards.length - 1;

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">今日日誌</h2>
        <CircleButtonPrimary
          size="md"
          aria-label="切換成今日帳目"
          onClick={() => {}}
        >
          <ArrowRight />
        </CircleButtonPrimary>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-9">
        <div className="mb-3 flex items-center justify-between pb-3">
          <CardLabelPrimary>今日日誌</CardLabelPrimary>
          <div className="flex items-center gap-3">
            <CircleButtonSecondary size="md" aria-label="展開日誌列表">
              <ArrowUpRight />
            </CircleButtonSecondary>
            <CircleButtonPrimary size="md" aria-label="前往日誌頁面">
              <Plus />
            </CircleButtonPrimary>
          </div>
        </div>

        <p className="font-label-md mb-5 text-neutral-700">
          {getStatusText(firstCard.checked)}
        </p>

        <DairyCard item={firstCard} />

        {isExpanded &&
          mockDiaryCards.slice(1).map((item) => (
            <div key={item.id} className="mt-3">
              <p className="font-label-md mb-5 text-neutral-700">
                {getStatusText(item.checked)}
              </p>
              <DairyCard item={item} className="flex flex-col gap-5" />
            </div>
          ))}

        {remainingCount > 0 && (
          <button
            type="button"
            className="font-label-md mt-3 flex w-full items-center justify-center gap-1 text-neutral-700"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? '收起' : `查看其他 ${remainingCount} 則日誌`}
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

export default DiarySummary;
