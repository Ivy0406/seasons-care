import { useState } from 'react';

import type { CareLogModalVariant } from '@/pages/CareLog/components/CareLogModal';
import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';

type UseDiaryCardActionsOptions = {
  items: CareLogEntry[];
  onUpdateEntry: (entry: CareLogEntry) => void;
  onDeleteEntry: (entryId: string) => void;
};

export type UseDiaryCardActionsResult = {
  detailEntry: CareLogEntry | null;
  editingEntry: CareLogEntry | null;
  modalKey: CareLogModalVariant | null;
  selectedActionEntry: CareLogEntry | null;
  closeActions: () => void;
  closeDetail: () => void;
  closeEdit: () => void;
  closeModal: () => void;
  confirmDelete: () => void;
  openActions: (entryId: string) => void;
  openDetail: (entryId: string) => void;
  openEdit: (entryId: string) => void;
  requestDeleteFromActions: () => void;
  requestDeleteFromDetail: () => void;
  submitEdit: (entry: CareLogEntry) => void;
};

function useDiaryCardActions({
  items,
  onUpdateEntry,
  onDeleteEntry,
}: UseDiaryCardActionsOptions): UseDiaryCardActionsResult {
  const [detailEntryId, setDetailEntryId] = useState<string | null>(null);
  const [selectedActionEntryId, setSelectedActionEntryId] = useState<
    string | null
  >(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<
    string | null
  >(null);
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
    setDetailEntryId(null);
    setSelectedActionEntryId(null);
    setEditingEntryId(entryId);
  };

  const closeEdit = () => {
    setEditingEntryId(null);
  };

  const requestDeleteFromActions = () => {
    if (selectedActionEntryId === null) return;

    setPendingDeleteEntryId(selectedActionEntryId);
    setSelectedActionEntryId(null);
    setModalKey('deleteConfirm');
  };

  const requestDeleteFromDetail = () => {
    if (detailEntryId === null) return;

    setPendingDeleteEntryId(detailEntryId);
    setModalKey('deleteConfirm');
  };

  const confirmDelete = () => {
    const entryId =
      pendingDeleteEntryId ?? selectedActionEntryId ?? detailEntryId;

    if (entryId === null) {
      setPendingDeleteEntryId(null);
      setModalKey(null);
      return;
    }

    onDeleteEntry(entryId);
    setDetailEntryId(null);
    setEditingEntryId(null);
    setSelectedActionEntryId(null);
    setPendingDeleteEntryId(null);
    setModalKey('deleteSuccess');
  };

  const submitEdit = (entry: CareLogEntry) => {
    onUpdateEntry(entry);
    setEditingEntryId(null);
    setModalKey('updateSuccess');
  };

  const closeModal = () => {
    setModalKey(null);
    setPendingDeleteEntryId(null);
  };

  return {
    detailEntry,
    editingEntry,
    modalKey,
    selectedActionEntry,
    closeActions,
    closeDetail,
    closeEdit,
    closeModal,
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
