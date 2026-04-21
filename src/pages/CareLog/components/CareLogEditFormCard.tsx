import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import type { CareLogEntry } from '@/pages/CareLog/types';

type CareLogEditFormCardProps = {
  entry: CareLogEntry;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void | Promise<void>;
  isSubmitting?: boolean;
};

function CareLogEditFormCard({
  entry,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CareLogEditFormCardProps) {
  return (
    <CareLogFormCard
      entry={entry}
      title="編輯日誌"
      submitLabel="更新日誌"
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

export default CareLogEditFormCard;
