import DataFormCard from '@/components/common/DataFormCard';
import { JournalDataSmallForm } from '@/components/common/SmallDataForm';

function DiaryDataFormCard() {
  return (
    <DataFormCard
      title="新日誌"
      className="bg-primary-dark"
      toneClassName="bg-primary-dark"
    >
      <DataFormCard.Content>
        <JournalDataSmallForm className="w-full border-0 bg-neutral-50 px-0 pt-3" />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default DiaryDataFormCard;
