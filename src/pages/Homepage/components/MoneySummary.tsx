import { useState } from 'react';

import { format } from 'date-fns';
import { Plus } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import CreateDataCard from '@/features/money/components/CreateDataCard';
import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

type MoneySummaryProps = {
  selectedDate: Date;
};
function MoneySummary({ selectedDate }: MoneySummaryProps) {
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const currentMonth = format(selectedDate, 'yyyy-MM');

  const { expenses } = useExpenses(currentMonth);
  const dailyExpenses = expenses.filter((e) =>
    e.expenseDate.replace('Z', '').startsWith(selectedDateStr),
  );
  const hasExpenses = dailyExpenses.length > 0;

  return (
    <section>
      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {hasExpenses ? (
          <div className="flex flex-col gap-3">
            {dailyExpenses.map((item) => (
              <EntryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCreateCard(true)}
            className="flex w-full flex-col items-center justify-center gap-5 rounded-md bg-neutral-100 px-4 py-10 text-center text-neutral-700"
          >
            <p className="font-paragraph-md">當日尚未有紀錄，快來新增吧！</p>
            <span className="flex items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-neutral-50">
              <Plus className="size-6" strokeWidth={2} />
            </span>
          </button>
        )}
      </div>

      <AlertDialog
        open={showCreateCard}
        onOpenChange={(open) => {
          if (!open) setShowCreateCard(false);
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-140 border-0 bg-transparent p-0 shadow-none">
            <CreateDataCard
              initialDate={selectedDate}
              onClose={() => setShowCreateCard(false)}
              onVoiceInput={() => {
                setShowCreateCard(false);
                setShowRecordingDrawer(true);
              }}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={() => setShowRecordingDrawer(false)}
      />
    </section>
  );
}

export default MoneySummary;
