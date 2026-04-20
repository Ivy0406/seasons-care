import type { RecurringEditMode } from '@/features/calendar/useDiaryCardActions';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import type { CareLogEntry } from '@/pages/CareLog/types';

type CareLogEditFormCardProps = {
  entry: CareLogEntry;
  editMode?: RecurringEditMode;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void | Promise<void>;
  isSubmitting?: boolean;
};

function CareLogEditFormCard({
  entry,
  editMode = 'default',
  onClose,
  onSubmit,
  isSubmitting = false,
}: CareLogEditFormCardProps) {
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  let title = '編輯日誌';
  let submitLabel = '更新日誌';

  if (entry.sourceType === 'event-series') {
    if (editMode === 'recurring-occurrence') {
      title = '編輯單次重複事件';
      submitLabel = '更新此事件';
    } else {
      title = '編輯重複事件';
      submitLabel = '更新重複事件';
    }
  }
  const formEditMode =
    editMode === 'recurring-occurrence' ? 'recurring-occurrence' : 'default';

  return (
    <CareLogFormCard
      entry={entry}
      title={title}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
      groupMembers={groupMembers}
      showVoiceInput={false}
      editMode={formEditMode}
    />
  );
}

export default CareLogEditFormCard;
