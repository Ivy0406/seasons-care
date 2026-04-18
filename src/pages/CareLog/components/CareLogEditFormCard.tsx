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
      title={
        entry.sourceType === 'event-series' ? '編輯單次重複事件' : '編輯日誌'
      }
      submitLabel={
        entry.sourceType === 'event-series' ? '更新此事件' : '更新日誌'
      }
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
      groupMembers={groupMembers}
      showVoiceInput={false}
      editMode={
        entry.sourceType === 'event-series' ? 'recurring-occurrence' : 'default'
      }
    />
  );
}

export default CareLogEditFormCard;
