import DataFormCard from '@/components/common/DataFormCard';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';

function MoneyDataFormCard() {
  return (
    <DataFormCard
      title="新帳目"
      className="bg-secondary-default"
      toneClassName="bg-secondary-default"
    >
      <DataFormCard.Content>
        <MoneyDataSmallForm className="w-full border-0 bg-neutral-50 px-0 pt-3" />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default MoneyDataFormCard;
