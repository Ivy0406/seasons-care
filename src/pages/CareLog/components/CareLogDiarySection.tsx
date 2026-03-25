import { useState } from 'react';

import { parseISO } from 'date-fns';

import DairyCard from '@/components/common/DairyCard';
import FilterDropdownButton from '@/components/common/FilterDropdownButton';
import UpdateDeleteDrawer from '@/components/common/UpdateDeleteDrawer';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import CareLogDetailCard from '@/pages/CareLog/components/CareLogDetailCard';
import CareLogEditFormCard from '@/pages/CareLog/components/CareLogEditFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
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
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedActionEntryId, setSelectedActionEntryId] = useState<
    string | null
  >(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<
    string | null
  >(null);
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);
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
  const selectedEntry =
    selectedEntryId === null
      ? null
      : (activeItems.find((item) => item.id === selectedEntryId) ?? null);
  const selectedActionEntry =
    selectedActionEntryId === null
      ? null
      : (activeItems.find((item) => item.id === selectedActionEntryId) ?? null);
  const editingEntry =
    editingEntryId === null
      ? null
      : (activeItems.find((item) => item.id === editingEntryId) ?? null);
  const openDeleteConfirm = (entryId: string | null) => {
    if (entryId === null) return;

    setPendingDeleteEntryId(entryId);
    setModalKey('deleteConfirm');
  };
  const handleDeleteConfirm = () => {
    const entryId =
      pendingDeleteEntryId ?? selectedActionEntryId ?? selectedEntryId;

    if (entryId === null) {
      setPendingDeleteEntryId(null);
      setModalKey(null);
      return;
    }

    onDeleteEntry(entryId);
    setSelectedEntryId(null);
    setSelectedActionEntryId(null);
    setPendingDeleteEntryId(null);
    setModalKey('deleteSuccess');
  };

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
          <DairyCard
            key={item.id}
            item={item}
            onClick={() => setSelectedEntryId(item.id)}
            onMoreClick={() => setSelectedActionEntryId(item.id)}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-neutral-600">
          <p className="font-paragraph-md">目前沒有符合條件的日誌紀錄。</p>
        </div>
      )}

      <UpdateDeleteDrawer
        open={selectedActionEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedActionEntryId(null);
          }
        }}
        onEdit={() => {
          if (selectedActionEntryId === null) return;

          setEditingEntryId(selectedActionEntryId);
        }}
        onDelete={() => {
          if (selectedActionEntryId === null) return;

          openDeleteConfirm(selectedActionEntryId);
        }}
        editLabel="編輯日誌"
        deleteLabel="刪除日誌"
      />

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
                onEdit={() => {
                  if (selectedEntryId === null) return;

                  setEditingEntryId(selectedEntryId);
                  setSelectedEntryId(null);
                }}
                onDelete={() => openDeleteConfirm(selectedEntryId)}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <AlertDialog
        open={editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEntryId(null);
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {editingEntry ? (
              <CareLogEditFormCard
                entry={editingEntry}
                onClose={() => setEditingEntryId(null)}
                onSubmit={(entry) => {
                  onUpdateEntry(entry);
                  setEditingEntryId(null);
                  setModalKey('updateSuccess');
                }}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      {modalKey ? (
        <CareLogModal
          open
          variant={modalKey}
          onClose={() => {
            setModalKey(null);
            setPendingDeleteEntryId(null);
          }}
          onConfirm={
            modalKey === 'deleteConfirm' ? handleDeleteConfirm : undefined
          }
        />
      ) : null}
    </section>
  );
}

export default CareLogDiarySection;
