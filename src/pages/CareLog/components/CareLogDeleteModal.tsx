import Modal from '@/components/common/Modal';

type CareLogDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function CareLogDeleteModal({
  open,
  onClose,
  onConfirm,
}: CareLogDeleteModalProps) {
  return (
    <Modal
      open={open}
      title="是否要刪除這項日誌？"
      confirmText="刪除"
      cancelText="取消"
      bodyClassName="gap-6"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}

export default CareLogDeleteModal;
