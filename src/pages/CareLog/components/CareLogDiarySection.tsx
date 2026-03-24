import { useState } from 'react';
import { parseISO } from 'date-fns';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import CareLogDeleteModal from '@/pages/CareLog/components/CareLogDeleteModal';
import CareLogDeleteResultModal from '@/pages/CareLog/components/CareLogDeleteResultModal';
import CareLogDetailCard from '@/pages/CareLog/components/CareLogDetailCard';
import DairyCard from '@/components/common/DairyCard';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import type {
  CareLogEntry,
  CareLogFilterValue,
} from '@/pages/CareLog/data/mockCareLogEntries';

type CareLogDiarySectionProps = {
  items: CareLogEntry[];
  selectedDate?: Date;
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
}: CareLogDiarySectionProps) {
  const [statusFilter, setStatusFilter] = useState<CareLogFilterValue>('all');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletedEntryIds, setDeletedEntryIds] = useState<string[]>([]);
  const [deleteResult, setDeleteResult] = useState<'success' | 'error' | null>(
    null,
  );
  const now = new Date();
  const filteredItems = [...items]
    .filter((item) => !deletedEntryIds.includes(item.id))
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
      (a, b) =>
        parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
    );
  const selectedEntry =
    selectedEntryId === null
      ? null
      : (filteredItems.find((item) => item.id === selectedEntryId) ?? null);
  const handleDeleteConfirm = () => {
    if (selectedEntryId === null) {
      setIsDeleteModalOpen(false);
      return;
    }

    setDeletedEntryIds((currentIds) => [...currentIds, selectedEntryId]);
    setSelectedEntryId(null);
    setIsDeleteModalOpen(false);
    setDeleteResult('success');
  };

  return (
    <section className="flex w-full flex-col gap-5">
      {selectedDate ? (
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col justify-between">
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
          <DairyCard
            key={item.id}
            item={item}
            onClick={() => setSelectedEntryId(item.id)}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-neutral-600">
          <p className="font-paragraph-md">目前沒有符合條件的日誌紀錄。</p>
        </div>
      )}

      <AlertDialog
        open={selectedEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEntryId(null);
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {selectedEntry ? (
              <CareLogDetailCard
                entry={selectedEntry}
                onClose={() => setSelectedEntryId(null)}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <CareLogDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {deleteResult ? (
        <CareLogDeleteResultModal
          open
          variant={deleteResult}
          onClose={() => setDeleteResult(null)}
        />
      ) : null}
    </section>
  );
}

export default CareLogDiarySection;
