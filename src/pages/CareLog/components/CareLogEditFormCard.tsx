import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import type { CareLogEntry } from '@/pages/CareLog/types';

type CareLogEditFormCardProps = {
  entry: CareLogEntry;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void;
};

function CareLogEditFormCard({
  entry,
  onClose,
  onSubmit,
}: CareLogEditFormCardProps) {
  return (
    <CareLogFormCard
      entry={entry}
      title="編輯日誌"
      submitLabel="更新日誌"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

export default CareLogEditFormCard;
