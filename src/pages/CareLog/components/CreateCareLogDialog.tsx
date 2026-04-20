import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
import useCreateCalendarEntry from '@/pages/CareLog/hooks/useCreateCalendarEntry';
import type { CareLogEntry } from '@/pages/CareLog/types';

type CreateCareLogDialogProps = {
  entry: CareLogEntry | null;
  onClose: () => void;
  onCreated?: (entry: Pick<CareLogEntry, 'startsAt'>) => Promise<void> | void;
};

function CreateCareLogDialog({
  entry,
  onClose,
  onCreated,
}: CreateCareLogDialogProps) {
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);
  const { isLoading, handleCreateCalendarEntry } = useCreateCalendarEntry();
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');

  return (
    <>
      <AlertDialog
        open={entry !== null}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {entry ? (
              <CareLogFormCard
                entry={entry}
                title="新任務"
                submitLabel="新增任務"
                isSubmitting={isLoading}
                cardClassName="bg-primary-default"
                toneClassName="-mt-0.5 bg-primary-default text-neutral-900"
                footerMode="submitOnly"
                groupMembers={groupMembers}
                onClose={onClose}
                onSubmit={async (nextEntry) => {
                  try {
                    const createdEntry =
                      await handleCreateCalendarEntry(nextEntry);

                    if (createdEntry === null) {
                      setModalKey('createError');
                      return;
                    }

                    await onCreated?.(createdEntry);
                    onClose();
                    setModalKey('createSuccess');
                  } catch {
                    setModalKey('createError');
                  }
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
          onClose={() => setModalKey(null)}
        />
      ) : null}
    </>
  );
}

export default CreateCareLogDialog;
