import UpdateDeleteDrawer from '@/components/common/UpdateDeleteDrawer';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import type { UseDiaryCardActionsResult } from '@/features/calendar/useDiaryCardActions';
import CareLogDetailCard from '@/pages/CareLog/components/CareLogDetailCard';
import CareLogEditFormCard from '@/pages/CareLog/components/CareLogEditFormCard';
import CareLogModal from '@/pages/CareLog/components/CareLogModal';

type DiaryCardActionLayerProps = {
  actions: UseDiaryCardActionsResult;
};

function DiaryCardActionLayer({ actions }: DiaryCardActionLayerProps) {
  const {
    detailEntry,
    editMode,
    editingEntry,
    isDeletingEntry,
    isUpdatingEntry,
    modalKey,
    selectedActionEntry,
    chooseRecurringOccurrenceEdit,
    chooseRecurringSeriesEdit,
    closeActions,
    closeDetail,
    closeEdit,
    closeModal,
    confirmDelete,
    openEdit,
    requestDeleteFromActions,
    requestDeleteFromDetail,
    submitEdit,
  } = actions;
  const shouldConfirmDelete =
    (modalKey === 'deleteConfirm' || modalKey === 'deleteRecurringConfirm') &&
    !isDeletingEntry;
  let modalConfirm: (() => void | Promise<void>) | undefined;
  let modalCancel: (() => void | Promise<void>) | undefined;

  if (modalKey === 'editRecurringChoice') {
    modalConfirm = chooseRecurringSeriesEdit;
    modalCancel = chooseRecurringOccurrenceEdit;
  } else if (shouldConfirmDelete) {
    modalConfirm = confirmDelete;
  }

  return (
    <>
      <UpdateDeleteDrawer
        open={selectedActionEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeActions();
          }
        }}
        onEdit={() => {
          if (selectedActionEntry === null) return;

          openEdit(selectedActionEntry.id);
        }}
        onDelete={requestDeleteFromActions}
        editLabel="編輯任務"
        deleteLabel="刪除任務"
      />

      <AlertDialog
        open={detailEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDetail();
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {detailEntry ? (
              <CareLogDetailCard
                entry={detailEntry}
                onClose={closeDetail}
                onEdit={() => openEdit(detailEntry.id)}
                onDelete={requestDeleteFromDetail}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <AlertDialog
        open={editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeEdit();
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {editingEntry ? (
              <CareLogEditFormCard
                entry={editingEntry}
                editMode={editMode}
                onClose={closeEdit}
                isSubmitting={isUpdatingEntry}
                onSubmit={submitEdit}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      {modalKey ? (
        <CareLogModal
          open
          variant={modalKey}
          onClose={closeModal}
          onCancel={modalCancel}
          onConfirm={modalConfirm}
        />
      ) : null}
    </>
  );
}

export default DiaryCardActionLayer;
