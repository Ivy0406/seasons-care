import { useState } from 'react';

import type { CareLogModalVariant } from '@/pages/CareLog/components/CareLogModal';
import type { CareLogEntry } from '@/pages/CareLog/types';

type RecurringEditMode =
  | 'default'
  | 'recurring-occurrence'
  | 'recurring-series';

type UseDiaryCardActionsOptions = {
  items: CareLogEntry[];
  onUpdateEntry: (
    entry: CareLogEntry,
    editMode?: RecurringEditMode,
  ) => Promise<boolean> | boolean;
  onDeleteEntry: (entryId: string) => Promise<boolean> | boolean;
  isUpdatingEntry?: boolean;
  isDeletingEntry?: boolean;
  initialDetailEntryId?: string;
};

export type UseDiaryCardActionsResult = {
  detailEntry: CareLogEntry | null;
  editingEntry: CareLogEntry | null;
  editMode: RecurringEditMode;
  modalKey: CareLogModalVariant | null;
  selectedActionEntry: CareLogEntry | null;
  isUpdatingEntry: boolean;
  isDeletingEntry: boolean;
  closeActions: () => void;
  closeDetail: () => void;
  closeEdit: () => void;
  closeModal: () => void;
  chooseRecurringOccurrenceEdit: () => void;
  chooseRecurringSeriesEdit: () => void;
  confirmDelete: () => Promise<void>;
  openActions: (entryId: string) => void;
  openDetail: (entryId: string) => void;
  openEdit: (entryId: string) => void;
  requestDeleteFromActions: () => void;
  requestDeleteFromDetail: () => void;
  submitEdit: (entry: CareLogEntry) => Promise<void>;
};

function useDiaryCardActions({
  items,
  onUpdateEntry,
  onDeleteEntry,
  isUpdatingEntry = false,
  isDeletingEntry = false,
  initialDetailEntryId,
}: UseDiaryCardActionsOptions): UseDiaryCardActionsResult {
  const [detailEntryId, setDetailEntryId] = useState<string | null>(
    initialDetailEntryId ?? null,
  );
  const [selectedActionEntryId, setSelectedActionEntryId] = useState<
    string | null
  >(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<
    string | null
  >(null);
  const [pendingRecurringEditEntryId, setPendingRecurringEditEntryId] =
    useState<string | null>(null);
  const [editMode, setEditMode] = useState<RecurringEditMode>('default');
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);

  const detailEntry =
    detailEntryId === null
      ? null
      : (items.find((item) => item.id === detailEntryId) ?? null);
  const selectedActionEntry =
    selectedActionEntryId === null
      ? null
      : (items.find((item) => item.id === selectedActionEntryId) ?? null);
  const editingEntry =
    editingEntryId === null
      ? null
      : (items.find((item) => item.id === editingEntryId) ?? null);

  const openDetail = (entryId: string) => {
    setDetailEntryId(entryId);
  };

  const closeDetail = () => {
    setDetailEntryId(null);
  };

  const openActions = (entryId: string) => {
    setSelectedActionEntryId(entryId);
  };

  const closeActions = () => {
    setSelectedActionEntryId(null);
  };

  const openEdit = (entryId: string) => {
    const targetEntry = items.find((item) => item.id === entryId);

    setDetailEntryId(null);
    setSelectedActionEntryId(null);

    if (targetEntry?.sourceType === 'event-series') {
      setPendingRecurringEditEntryId(entryId);
      setModalKey('editRecurringChoice');
      return;
    }

    setEditMode('default');
    setEditingEntryId(entryId);
  };

  const closeEdit = () => {
    setEditingEntryId(null);
    setEditMode('default');
  };

  const chooseRecurringOccurrenceEdit = () => {
    if (pendingRecurringEditEntryId === null) return;

    setEditMode('recurring-occurrence');
    setEditingEntryId(pendingRecurringEditEntryId);
    setPendingRecurringEditEntryId(null);
    setModalKey(null);
  };

  const chooseRecurringSeriesEdit = () => {
    if (pendingRecurringEditEntryId === null) return;

    setEditMode('recurring-series');
    setEditingEntryId(pendingRecurringEditEntryId);
    setPendingRecurringEditEntryId(null);
    setModalKey(null);
  };

  const requestDeleteFromActions = () => {
    if (selectedActionEntryId === null) return;

    const targetEntry = items.find((item) => item.id === selectedActionEntryId);

    setPendingDeleteEntryId(selectedActionEntryId);
    setSelectedActionEntryId(null);
    setModalKey(
      targetEntry?.sourceType === 'event-series'
        ? 'deleteRecurringConfirm'
        : 'deleteConfirm',
    );
  };

  const requestDeleteFromDetail = () => {
    if (detailEntryId === null) return;

    const targetEntry = items.find((item) => item.id === detailEntryId);

    setPendingDeleteEntryId(detailEntryId);
    setModalKey(
      targetEntry?.sourceType === 'event-series'
        ? 'deleteRecurringConfirm'
        : 'deleteConfirm',
    );
  };

  const confirmDelete = async () => {
    const entryId =
      pendingDeleteEntryId ?? selectedActionEntryId ?? detailEntryId;

    if (entryId === null) {
      setPendingDeleteEntryId(null);
      setModalKey(null);
      return;
    }

    const didDelete = await onDeleteEntry(entryId);

    if (!didDelete) {
      setModalKey('deleteError');
      return;
    }

    setDetailEntryId(null);
    setEditingEntryId(null);
    setSelectedActionEntryId(null);
    setPendingDeleteEntryId(null);
    setModalKey('deleteSuccess');
  };

  const submitEdit = async (entry: CareLogEntry) => {
    const didUpdate = await onUpdateEntry(entry, editMode);

    if (!didUpdate) {
      return;
    }

    setEditingEntryId(null);
    setEditMode('default');
    setModalKey('updateSuccess');
  };

  const closeModal = () => {
    setModalKey(null);
    setPendingDeleteEntryId(null);
    setPendingRecurringEditEntryId(null);
  };

  return {
    detailEntry,
    editingEntry,
    editMode,
    isUpdatingEntry,
    isDeletingEntry,
    modalKey,
    selectedActionEntry,
    closeActions,
    closeDetail,
    closeEdit,
    closeModal,
    chooseRecurringOccurrenceEdit,
    chooseRecurringSeriesEdit,
    confirmDelete,
    openActions,
    openDetail,
    openEdit,
    requestDeleteFromActions,
    requestDeleteFromDetail,
    submitEdit,
  };
}

export default useDiaryCardActions;
export type { RecurringEditMode };
