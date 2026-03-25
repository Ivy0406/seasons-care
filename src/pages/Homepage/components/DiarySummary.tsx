import { useState } from 'react';

import { parseISO } from 'date-fns';
import {
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minimize2,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { CardLabelPrimary } from '@/components/common/CardLabel';
import {
  CircleButtonPrimary,
  CircleButtonSecondary,
} from '@/components/common/CircleIButton';
import DairyCard, { type DairyCardItem } from '@/components/common/DairyCard';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import mockCareLogEntries from '@/pages/CareLog/data/mockCareLogEntries';

type StatusGroup = '進行中' | '未完成' | '已完成';

function getStatusText(card: DairyCardItem): StatusGroup {
  if (card.status === 'completed') return '已完成';
  if (parseISO(card.startsAt).getTime() <= Date.now()) return '進行中';
  return '未完成';
}

const STATUS_ORDER: StatusGroup[] = ['進行中', '未完成', '已完成'];

function groupByStatus(
  cards: DairyCardItem[],
): Record<StatusGroup, DairyCardItem[]> {
  return cards.reduce(
    (totalCards, card) => {
      const status = getStatusText(card);
      totalCards[status].push(card);
      return totalCards;
    },
    { 進行中: [], 未完成: [], 已完成: [] } as Record<
      StatusGroup,
      DairyCardItem[]
    >,
  );
}

type DiarySummaryProps = {
  onSwitchToMoney: () => void;
};

function DiarySummary({ onSwitchToMoney }: DiarySummaryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const firstCard = mockCareLogEntries[0];
  const remainingCount = mockCareLogEntries.length - 1;
  const grouped = groupByStatus(mockCareLogEntries);
  const navigate = useNavigate();

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">今日日誌</h2>
        <CircleButtonPrimary
          size="md"
          aria-label="切換成今日帳目"
          onClick={onSwitchToMoney}
        >
          <ArrowRight />
        </CircleButtonPrimary>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        <div className="mb-3 flex items-center justify-between pb-3">
          <CardLabelPrimary>今日日誌</CardLabelPrimary>
          <div className="flex items-center gap-3">
            <CircleButtonSecondary
              size="md"
              aria-label="展開日誌列表"
              onClick={() => setModalOpen(true)}
            >
              <ArrowUpRight />
            </CircleButtonSecondary>
            <CircleButtonPrimary
              size="md"
              aria-label="前往日誌頁面"
              onClick={() => navigate('/calendar-page')}
            >
              <Plus />
            </CircleButtonPrimary>
          </div>
        </div>

        <p className="font-label-md mb-5 text-neutral-700">
          {getStatusText(firstCard)}
        </p>
        <DairyCard item={firstCard} />

        {isExpanded &&
          mockCareLogEntries.slice(1).map((item: DairyCardItem) => (
            <div key={item.id} className="mt-3">
              <p className="font-label-md mb-3 text-neutral-700">
                {getStatusText(item)}
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

      <AlertDialog open={modalOpen} onOpenChange={(o) => setModalOpen(o)}>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="max-h-[80vh] w-[calc(100vw-48px)] max-w-lg overflow-y-auto bg-neutral-100 px-5 pt-5 pb-3">
            <div className="mb-3 flex items-center justify-between pb-3">
              <CardLabelPrimary>今日日誌</CardLabelPrimary>
              <div className="flex items-center gap-3">
                <CircleButtonSecondary
                  size="md"
                  aria-label="收起日誌列表"
                  onClick={() => setModalOpen(false)}
                >
                  <Minimize2 />
                </CircleButtonSecondary>
                <CircleButtonPrimary size="md" aria-label="新增日誌">
                  <Plus />
                </CircleButtonPrimary>
              </div>
            </div>

            {STATUS_ORDER.map((status) => {
              const cards = grouped[status];
              if (cards.length === 0) return null;
              return (
                <div key={status}>
                  <p className="font-label-md mb-3 text-neutral-700">
                    {status}
                  </p>
                  {cards.map((item) => (
                    <DairyCard key={item.id} item={item} className="mb-3" />
                  ))}
                </div>
              );
            })}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </section>
  );
}

export default DiarySummary;
