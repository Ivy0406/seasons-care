import DataFormCard from '@/components/common/DataFormCard';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import VoiceCTA from '@/components/common/voiceCTA';
import { createEmptyMoneyDraft } from '@/features/voice/services/moneyParser';

type CreateDataCardProps = {
  onClose: () => void;
  onVoiceInput?: () => void;
};

function CreateDataCard({ onClose, onVoiceInput }: CreateDataCardProps) {
  return (
    <form>
      <DataFormCard
        title="新帳目"
        className="bg-secondary-default"
        toneClassName="bg-secondary-default"
        contentClassName="p-0"
      >
        <DataFormCard.Content>
          <VoiceCTA
            className="bg-primary-default"
            title="記帳"
            onClose={onClose}
            onInputClick={() => onVoiceInput?.()}
          />
          <MoneyDataSmallForm
            className="w-full border-0 bg-neutral-50 px-3 pt-3"
            value={createEmptyMoneyDraft()}
            onChange={() => {}}
          />
        </DataFormCard.Content>
        <DataFormCard.Footer>
          <RoundedButtonPrimary type="submit" className="w-full">
            新增帳目
          </RoundedButtonPrimary>
        </DataFormCard.Footer>
      </DataFormCard>
    </form>
  );
}

export default CreateDataCard;
