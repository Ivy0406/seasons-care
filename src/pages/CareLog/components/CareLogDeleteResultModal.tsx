import Modal from '@/components/common/Modal';

type CareLogDeleteResultModalProps = {
  open: boolean;
  variant: 'success' | 'error';
  onClose: () => void;
};

const modalContent = {
  success: {
    title: '日誌刪除完成!',
    description: '',
  },
  error: {
    title: '日誌刪除失敗!',
    description: '發生預期外的問題，請稍後再嘗試。',
  },
} as const;

function CareLogDeleteResultModal({
  open,
  variant,
  onClose,
}: CareLogDeleteResultModalProps) {
  const content = modalContent[variant];

  return (
    <Modal
      open={open}
      variant={variant}
      title={content.title}
      description={content.description}
      bodyClassName="gap-2"
      autoCloseMs={variant === 'success' ? 1600 : undefined}
      onClose={onClose}
    />
  );
}

export default CareLogDeleteResultModal;
