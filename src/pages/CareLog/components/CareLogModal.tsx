import Modal from '@/components/common/Modal';

type CareLogModalVariant =
  | 'deleteConfirm'
  | 'deleteRecurringConfirm'
  | 'deleteSuccess'
  | 'deleteError'
  | 'updateSuccess'
  | 'createSuccess'
  | 'createError';

type CareLogModalProps = {
  open: boolean;
  variant: CareLogModalVariant;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
};

const modalContent = {
  deleteConfirm: {
    status: 'confirm',
    title: '是否要刪除這項日誌？',
    description: '',
    confirmText: '刪除',
    cancelText: '取消',
    bodyClassName: 'gap-6',
  },
  deleteRecurringConfirm: {
    status: 'confirm',
    title: '確定要刪除這個重複事件嗎？',
    description:
      '刪除後，這組重複事件的所有內容都會一起移除，包括已完成、已編輯的紀錄與未來重複事件。此操作無法復原。',
    confirmText: '刪除',
    cancelText: '取消',
    bodyClassName: 'gap-6',
  },
  deleteSuccess: {
    status: 'success',
    title: '日誌刪除完成!',
    description: '',
    bodyClassName: 'gap-2',
  },
  deleteError: {
    status: 'error',
    title: '日誌刪除失敗!',
    description: '發生預期外的問題，請稍後再嘗試。',
    bodyClassName: 'gap-2',
  },
  updateSuccess: {
    status: 'success',
    title: '日誌更新成功!',
    description: '',
    bodyClassName: 'gap-2',
  },
  createSuccess: {
    status: 'success',
    title: '建立完成!',
    description: '',
    bodyClassName: 'gap-2',
  },
  createError: {
    status: 'error',
    title: '建立失敗!',
    description: '發生預期外的問題，請稍後再嘗試。',
    bodyClassName: 'gap-2',
  },
} as const;

function CareLogModal({
  open,
  variant,
  onClose,
  onConfirm,
}: CareLogModalProps) {
  const content = modalContent[variant];

  return (
    <Modal
      open={open}
      variant={content.status}
      title={content.title}
      description={content.description}
      confirmText={
        content.status === 'confirm' ? content.confirmText : undefined
      }
      cancelText={content.status === 'confirm' ? content.cancelText : undefined}
      bodyClassName={content.bodyClassName}
      autoCloseMs={content.status === 'success' ? 1600 : undefined}
      onConfirm={content.status === 'confirm' ? onConfirm : undefined}
      onClose={onClose}
    />
  );
}

export default CareLogModal;
export type { CareLogModalVariant };
