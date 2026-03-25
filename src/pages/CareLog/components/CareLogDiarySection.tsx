import { useState } from 'react';

import { parseISO } from 'date-fns';

import DiaryCard from '@/components/common/DiaryCard';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
import type {
  CareLogEntry,
  CareLogFilterValue,
} from '@/pages/CareLog/data/mockCareLogEntries';

type CareLogDiarySectionProps = {
  items: CareLogEntry[];
  selectedDate?: Date;
  onUpdateEntry: (entry: CareLogEntry) => void;
  onDeleteEntry: (entryId: string) => void;
};

const statusFilterOptions = [
  { label: '全部顯示', value: 'all' },
  { label: '僅顯示未開始', value: 'notStarted' },
  { label: '僅顯示已開始', value: 'started' },
  { label: '僅顯示已完成', value: 'completed' },
] satisfies { label: string; value: CareLogFilterValue }[];

function CareLogDiarySection({
  items,
  selectedDate,
  onUpdateEntry,
  onDeleteEntry,
}: CareLogDiarySectionProps) {
  const [statusFilter, setStatusFilter] = useState<CareLogFilterValue>('all');
  const diaryCardActions = useDiaryCardActions({
    items,
    onUpdateEntry,
    onDeleteEntry,
  });
  const now = new Date();
  const activeItems = items;
  const filteredItems = [...activeItems]
    .filter((item) => {
      const startTime = parseISO(item.startsAt).getTime();

      switch (statusFilter) {
        case 'notStarted':
          return item.status !== 'completed' && startTime > now.getTime();
        case 'started':
          return item.status !== 'completed' && startTime <= now.getTime();
        case 'completed':
          return item.status === 'completed';
        case 'all':
        default:
          return true;
      }
    })
    .sort(
      (a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
    );

  return (
    <section className="flex w-full flex-col gap-5">
      {selectedDate ? (
        <header className="flex items-start justify-between gap-3">
          <div className="font-heading-md flex flex-col justify-between">
            <p>日誌列表</p>
          </div>
          <FilterDropdownButton
            value={statusFilter}
            options={statusFilterOptions}
            onChange={setStatusFilter}
          />
        </header>
      ) : null}

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <DiaryCard
            key={item.id}
            item={item}
            onClick={() => diaryCardActions.openDetail(item.id)}
            onMoreClick={() => diaryCardActions.openActions(item.id)}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-neutral-600">
          <p className="font-paragraph-md">目前沒有符合條件的日誌紀錄。</p>
        </div>
      )}

      <DiaryCardActionLayer actions={diaryCardActions} />
    </section>
  );
}

export default CareLogDiarySection;
