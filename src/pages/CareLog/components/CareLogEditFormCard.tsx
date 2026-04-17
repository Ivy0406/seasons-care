import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
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
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');

  return (
    <CareLogFormCard
      entry={entry}
      title="編輯任務"
      submitLabel="更新任務"
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
      groupMembers={groupMembers}
      showVoiceInput={false}
    />
  );
}

export default CareLogEditFormCard;
