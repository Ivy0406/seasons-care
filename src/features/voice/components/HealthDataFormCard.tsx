import DataFormCard from '@/components/common/DataFormCard';
import { HealthDataSmallForm } from '@/components/common/SmallDataForm';
import type { HealthDraft } from '@/features/health/types';

type HealthDataFormCardProps = {
  value: HealthDraft;
  onChange: (updates: Partial<HealthDraft>) => void;
};

function HealthDataFormCard({ value, onChange }: HealthDataFormCardProps) {
  return (
    <DataFormCard title="健康數值紀錄" className="bg-neutral-200">
      <DataFormCard.Content>
        <HealthDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default HealthDataFormCard;
