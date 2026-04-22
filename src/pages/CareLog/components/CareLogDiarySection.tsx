import { useState } from 'react';

import { parseISO } from 'date-fns';

import DiaryCard from '@/components/common/DiaryCard';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import type { RecurringEditMode } from '@/features/calendar/useDiaryCardActions';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
import CareLogEmptyState from '@/pages/CareLog/components/CareLogEmptyState';
import type { CareLogEntry, CareLogFilterValue } from '@/pages/CareLog/types';

type StatusGroup = '進行中' | '未開始' | '未完成' | '已完成';

type CareLogDiarySectionProps = {
  items: CareLogEntry[];
  selectedDate?: Date;
  onUpdateEntry: (
    entry: CareLogEntry,
    editMode?: RecurringEditMode,
  ) => Promise<boolean> | boolean;
  onDeleteEntry: (entryId: string) => Promise<boolean> | boolean;
  onToggleStatus: (
    entryId: string,
    status: CareLogEntry['status'],
  ) => Promise<boolean> | boolean;
  onCreateEntry: (date?: Date) => void;
  isUpdatingEntry?: boolean;
  isDeletingEntry?: boolean;
  initialDetailEntryId?: string;
};

const STATUS_ORDER: StatusGroup[] = ['進行中', '未開始', '未完成', '已完成'];

const statusFilterOptions = [
  { label: '全部顯示', value: 'all' },
  { label: '僅顯示未開始', value: 'notStarted' },
  { label: '僅顯示已開始', value: 'started' },
  { label: '僅顯示已完成', value: 'completed' },
] satisfies { label: string; value: CareLogFilterValue }[];

function getStatusText(card: CareLogEntry): StatusGroup {
  if (card.status === 'completed') return '已完成';
  if (parseISO(card.startsAt).getTime() <= Date.now()) return '進行中';
  return '未開始';
}

function groupByStatus(
  cards: CareLogEntry[],
): Record<StatusGroup, CareLogEntry[]> {
  return cards.reduce(
    (totalCards, card) => {
      const status = getStatusText(card);
      totalCards[status].push(card);
      return totalCards;
    },
    { 進行中: [], 未開始: [], 未完成: [], 已完成: [] } as Record<
      StatusGroup,
      CareLogEntry[]
    >,
  );
}

function CareLogDiarySection({
  items,
  selectedDate,
  onUpdateEntry,
  onDeleteEntry,
  onToggleStatus,
  onCreateEntry,
  isUpdatingEntry = false,
  isDeletingEntry = false,
  initialDetailEntryId,
}: CareLogDiarySectionProps) {
  const [statusFilter, setStatusFilter] = useState<CareLogFilterValue>('all');
  const diaryCardActions = useDiaryCardActions({
    items,
    onUpdateEntry,
    onDeleteEntry,
    isUpdatingEntry,
    isDeletingEntry,
    initialDetailEntryId,
  });

  const now = new Date();
  const filteredItems = [...items]
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

  const grouped = groupByStatus(filteredItems);
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  return (
    <section className="flex w-full flex-col gap-5">
      {selectedDate ? (
        <header className="flex items-start justify-between">
          <p className="font-heading-md">任務列表</p>
          <FilterDropdownButton
            value={statusFilter}
            options={statusFilterOptions}
            onChange={setStatusFilter}
          />
        </header>
      ) : null}

      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {!hasFilteredItems ? (
          <CareLogEmptyState
            message={
              !hasItems
                ? '當日尚未有紀錄，快來新增吧！'
                : '目前沒有符合篩選條件的任務。'
            }
            onCreateEntry={
              !hasItems ? () => onCreateEntry(selectedDate) : undefined
            }
            className="border-0 bg-neutral-100"
          />
        ) : null}
        {STATUS_ORDER.map((status) => {
          const cards = grouped[status];
          if (cards.length === 0) return null;
          return (
            <div key={status} className="mb-3">
              <p className="font-label-md mb-3 text-neutral-700">{status}</p>
              {cards.map((item) => (
                <DiaryCard
                  key={item.id}
                  item={item}
                  className="mb-3"
                  isStatusUpdating={isUpdatingEntry}
                  onClick={() => diaryCardActions.openDetail(item.id)}
                  onMoreClick={
                    item.sourceType === 'event-series'
                      ? undefined
                      : () => diaryCardActions.openActions(item.id)
                  }
                  onStatusChange={(checked) =>
                    onToggleStatus(item.id, checked ? 'completed' : 'pending')
                  }
                />
              ))}
            </div>
          );
        })}
      </div>

      <DiaryCardActionLayer actions={diaryCardActions} />
    </section>
  );
}

export default CareLogDiarySection;
