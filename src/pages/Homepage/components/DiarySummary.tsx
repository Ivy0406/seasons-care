import { parseISO } from 'date-fns';

import DiaryCard, { type DiaryCardItem } from '@/components/common/DiaryCard';
import mockCareLogEntries from '@/pages/CareLog/data/mockCareLogEntries';

type StatusGroup = '進行中' | '未完成' | '已完成';

function getStatusText(card: DiaryCardItem): StatusGroup {
  if (card.status === 'completed') return '已完成';
  if (parseISO(card.startsAt).getTime() <= Date.now()) return '進行中';
  return '未完成';
}

const STATUS_ORDER: StatusGroup[] = ['進行中', '未完成', '已完成'];

function groupByStatus(
  cards: DiaryCardItem[],
): Record<StatusGroup, DiaryCardItem[]> {
  return cards.reduce(
    (totalCards, card) => {
      const status = getStatusText(card);
      totalCards[status].push(card);
      return totalCards;
    },
    { 進行中: [], 未完成: [], 已完成: [] } as Record<
      StatusGroup,
      DiaryCardItem[]
    >,
  );
}

const grouped = groupByStatus(mockCareLogEntries);

function DiarySummary() {
  return (
    <section>
      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {STATUS_ORDER.map((status) => {
          const cards = grouped[status];
          if (cards.length === 0) return null;
          return (
            <div key={status} className="mb-3">
              <p className="font-label-md mb-3 text-neutral-700">{status}</p>
              {cards.map((item) => (
                <DiaryCard key={item.id} item={item} className="mb-3" />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DiarySummary;
