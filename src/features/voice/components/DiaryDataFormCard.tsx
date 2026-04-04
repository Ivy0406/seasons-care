import DataFormCard from '@/components/common/DataFormCard';
import { JournalDataSmallForm } from '@/components/common/SmallDataForm';
import type { DiaryDraft } from '@/pages/CareLog/types';

type DiaryDataFormCardProps = {
  value: DiaryDraft;
  onChange: (updates: Partial<DiaryDraft>) => void;
};

function DiaryDataFormCard({ value, onChange }: DiaryDataFormCardProps) {
  return (
    <DataFormCard
      title="新日誌"
      className="bg-primary-default"
      toneClassName="bg-primary-default"
    >
      <DataFormCard.Content>
        <JournalDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default DiaryDataFormCard;
