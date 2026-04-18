import { useState } from 'react';

import { parseISO } from 'date-fns';

import DiaryCard from '@/components/common/DiaryCard';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
import CareLogEmptyState from '@/pages/CareLog/components/CareLogEmptyState';
import type { CareLogEntry, CareLogFilterValue } from '@/pages/CareLog/types';

type CareLogDiarySectionProps = {
  items: CareLogEntry[];
  selectedDate?: Date;
  onUpdateEntry: (entry: CareLogEntry) => Promise<boolean> | boolean;
  onDeleteEntry: (entryId: string) => Promise<boolean> | boolean;
  onToggleStatus: (
    entryId: string,
    status: CareLogEntry['status'],
  ) => Promise<boolean> | boolean;
  onCreateEntry: (date?: Date) => void;
  isUpdatingEntry?: boolean;
  isDeletingEntry?: boolean;
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
  onToggleStatus,
  onCreateEntry,
  isUpdatingEntry = false,
  isDeletingEntry = false,
}: CareLogDiarySectionProps) {
  const [statusFilter, setStatusFilter] = useState<CareLogFilterValue>('all');
  const diaryCardActions = useDiaryCardActions({
    items,
    onUpdateEntry,
    onDeleteEntry,
    isUpdatingEntry,
    isDeletingEntry,
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
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  let emptyState: React.ReactNode = null;

  if (!hasFilteredItems) {
    if (!hasItems) {
      emptyState = (
        <CareLogEmptyState
          message="當日尚未有紀錄，快來新增吧！"
          onCreateEntry={() => onCreateEntry(selectedDate)}
        />
      );
    } else {
      emptyState = <CareLogEmptyState message="目前沒有符合篩選條件的日誌。" />;
    }
  }
  return (
    <section className="flex w-full flex-col gap-5">
      {selectedDate ? (
        <header className="flex items-start justify-between">
          <div className="flex flex-col justify-between">
            <p className="font-heading-md">日誌列表</p>
          </div>
          <FilterDropdownButton
            value={statusFilter}
            options={statusFilterOptions}
            onChange={setStatusFilter}
          />
        </header>
      ) : null}

      {hasFilteredItems
        ? filteredItems.map((item) => (
            <DiaryCard
              key={item.id}
              item={item}
              onClick={() => diaryCardActions.openDetail(item.id)}
              onMoreClick={
                item.sourceType === 'event-series'
                  ? undefined
                  : () => diaryCardActions.openActions(item.id)
              }
              isStatusUpdating={isUpdatingEntry}
              onStatusChange={(checked) =>
                onToggleStatus(item.id, checked ? 'completed' : 'pending')
              }
            />
          ))
        : emptyState}

      <DiaryCardActionLayer actions={diaryCardActions} />
    </section>
  );
}

export default CareLogDiarySection;
