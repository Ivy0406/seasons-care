import { X } from 'lucide-react';

import Loading from '@/components/common/Loading';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import SplitItemsPreview from '@/features/money/components/SplitItemsPreview';
import SplitResultPreview from '@/features/money/components/SplitResultPreview';
import type { MemberSplit, SplitItem } from '@/features/money/types';

type SplitRecordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  executedByName?: string;
  selectedItems?: SplitItem[];
  memberSplits?: MemberSplit[];
};

function SplitRecordDialog({
  open,
  onOpenChange,
  isLoading,
  executedByName,
  selectedItems,
  memberSplits,
}: SplitRecordDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup className="h-95vh flex w-92.25 flex-col rounded-sm border-0 bg-neutral-200 px-6 pt-3 pb-5">
          <AlertDialogClose
            className="absolute top-4 right-6 flex size-7 items-center justify-center rounded-full text-neutral-900"
            aria-label="關閉"
          >
            <X className="size-4" strokeWidth={3} />
          </AlertDialogClose>

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-baseline justify-between pt-7">
                <p className="font-heading-sm text-neutral-900">
                  {executedByName} 已執行分帳
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                <SplitItemsPreview items={selectedItems ?? []} />
                <SplitResultPreview memberSplits={memberSplits ?? []} />
              </div>

              <RoundedButtonPrimary
                className="mt-4 h-[45.6px] w-full rounded-full bg-neutral-900 text-neutral-50"
                onClick={() => onOpenChange(false)}
              >
                關閉
              </RoundedButtonPrimary>
            </>
          )}
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default SplitRecordDialog;
