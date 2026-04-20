import DataFormCard from '@/components/common/DataFormCard';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import type { MoneyDraft } from '@/features/money/types';

type MoneyDataFormCardProps = {
  value: MoneyDraft;
  onChange: (updates: Partial<MoneyDraft>) => void;
};

function MoneyDataFormCard({ value, onChange }: MoneyDataFormCardProps) {
  return (
    <DataFormCard
      title="新帳目"
      className="bg-secondary-default"
      toneClassName="bg-secondary-default"
    >
      <DataFormCard.Content>
        <MoneyDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default MoneyDataFormCard;
