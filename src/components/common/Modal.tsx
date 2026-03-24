import { useEffect, type ReactNode } from 'react';

import { Check, X } from 'lucide-react';

import { CheckBoxButton } from '@/components/common/CircleIButton';
import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import cn from '@/lib/utils';

type ModalVariant = 'confirm' | 'success' | 'error';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  variant?: ModalVariant;
  autoCloseMs?: number;
  confirmText?: string;
  cancelText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose: () => void;
  className?: string;
  bodyClassName?: string;
};

function StatusIcon({
  variant,
  onClick,
}: {
  variant: Exclude<ModalVariant, 'confirm'>;
  onClick?: () => void;
}) {
  const iconMap: Record<Exclude<ModalVariant, 'confirm'>, ReactNode> = {
    error: (
      <CheckBoxButton
        size="modal"
        checked={false}
        onClick={onClick}
        uncheckedClassName="bg-error text-neutral-900"
        aria-label="關閉失敗提示"
      >
        <X className="size-4" strokeWidth={2.5} />
      </CheckBoxButton>
    ),
    success: (
      <CheckBoxButton
        size="modal"
        checked
        onClick={onClick}
        checkedClassName="bg-primary-default text-neutral-900"
        aria-label="關閉成功提示"
      >
        <Check className="size-4" strokeWidth={2.5} />
      </CheckBoxButton>
    ),
  };

  return iconMap[variant];
}

function Modal({
  open,
  title,
  description,
  variant = 'confirm',
  autoCloseMs,
  confirmText = '刪除',
  cancelText = '取消',
  onCancel,
  onConfirm,
  onClose,
  className,
  bodyClassName,
}: ModalProps) {
  const isConfirmVariant = variant === 'confirm';
  const handleCancel = onCancel ?? onClose;

  useEffect(() => {
    if (!open || variant !== 'success' || !autoCloseMs) return undefined;

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => window.clearTimeout(timeoutId);
  }, [autoCloseMs, onClose, open, variant]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
    >
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup
          className={cn('bg-neutral-100 px-5 pt-5 pb-8', className)}
        >
          {isConfirmVariant ? (
            <div className="mb-6 flex justify-end">
              <AlertDialogClose
                type="button"
                aria-label="關閉 modal"
                className="inline-flex size-6 items-center justify-center rounded-full text-neutral-800"
              >
                <X className="size-4" strokeWidth={3} />
              </AlertDialogClose>
            </div>
          ) : null}

          <div
            className={cn(
              'flex flex-col items-center',
              isConfirmVariant ? 'gap-10' : 'gap-3 py-5 pb-2',
              bodyClassName,
            )}
          >
            <div className="font-heading-sm flex flex-col items-center gap-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              {description ? (
                <AlertDialogDescription className="font-label-md">
                  {description}
                </AlertDialogDescription>
              ) : null}
            </div>

            {isConfirmVariant ? (
              <div className="flex w-full gap-5">
                <RoundedButtonSecondary
                  className="min-w-0 flex-1 text-base"
                  onClick={handleCancel}
                >
                  {cancelText}
                </RoundedButtonSecondary>
                <RoundedButtonPrimary
                  className="min-w-0 flex-1 text-base"
                  onClick={onConfirm}
                >
                  {confirmText}
                </RoundedButtonPrimary>
              </div>
            ) : (
              <StatusIcon variant={variant} onClick={onClose} />
            )}
          </div>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default Modal;
