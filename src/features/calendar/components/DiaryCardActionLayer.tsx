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
    editingEntry,
    isDeletingEntry,
    isUpdatingEntry,
    modalKey,
    selectedActionEntry,
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
        editLabel="編輯日誌"
        deleteLabel="刪除日誌"
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
                onEdit={
                  detailEntry.sourceType === 'event-series'
                    ? undefined
                    : () => openEdit(detailEntry.id)
                }
                onDelete={
                  detailEntry.sourceType === 'event-series'
                    ? undefined
                    : requestDeleteFromDetail
                }
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
          onConfirm={
            modalKey === 'deleteConfirm' && !isDeletingEntry
              ? confirmDelete
              : undefined
          }
        />
      ) : null}
    </>
  );
}

export default DiaryCardActionLayer;
