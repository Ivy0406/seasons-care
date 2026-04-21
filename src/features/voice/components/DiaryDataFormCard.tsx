import DataFormCard from '@/components/common/DataFormCard';
import { JournalDataSmallForm } from '@/components/common/SmallDataForm';
import type { DiaryDraft } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type DiaryDataFormCardProps = {
  title?: string;
  value: DiaryDraft;
  onChange: (updates: Partial<DiaryDraft>) => void;
  groupMembers?: GroupMember[];
  participantIds?: string[];
  onParticipantsChange?: (ids: string[]) => void;
};

function DiaryDataFormCard({
  title = '新任務',
  value,
  onChange,
  groupMembers = [],
  participantIds = [],
  onParticipantsChange,
}: DiaryDataFormCardProps) {
  return (
    <DataFormCard
      title={title}
      className="bg-primary-default"
      toneClassName="bg-primary-default"
    >
      <DataFormCard.Content>
        <JournalDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
          groupMembers={groupMembers}
          participantIds={participantIds}
          onParticipantsChange={onParticipantsChange}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default DiaryDataFormCard;
