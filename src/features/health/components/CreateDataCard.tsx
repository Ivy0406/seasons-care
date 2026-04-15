import DataFormCard from '@/components/common/DataFormCard';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import { HealthDataForm } from '@/components/common/SmallDataForm';
import VoiceCTA from '@/components/common/voiceCTA';
import useCreateHealthData from '@/features/health/hooks/useCreateHealthData';

type CreateDataCardProps = {
  onClose: () => void;
  onVoiceInput?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
};

function CreateDataCard({
  onClose,
  onVoiceInput,
  onSuccess,
  onError,
}: CreateDataCardProps) {
  const {
    register,
    handleSubmit,
    isLoading,
    hasAnyValue,
    recordDate,
    recordTime,
    setRecordDate,
    setRecordTime,
  } = useCreateHealthData({ onSuccess, onError });

  return (
    <form onSubmit={handleSubmit}>
      <DataFormCard
        title="健康數值紀錄"
        className="bg-neutral-200"
        contentClassName="p-0"
      >
        <DataFormCard.Content>
          <VoiceCTA
            className="bg-primary-default"
            title=""
            onClose={onClose}
            onInputClick={() => {
              onVoiceInput?.();
            }}
          />
          <HealthDataForm
            className="w-full border-0 bg-neutral-50 px-3 pt-3"
            register={register}
            recordDate={recordDate}
            recordTime={recordTime}
            onDateChange={setRecordDate}
            onTimeChange={setRecordTime}
          />
        </DataFormCard.Content>
        <DataFormCard.Footer>
          <RoundedButtonPrimary
            type="submit"
            className="w-full"
            disabled={!hasAnyValue || isLoading}
          >
            {isLoading ? '新增中...' : '新增健康數值'}
          </RoundedButtonPrimary>
        </DataFormCard.Footer>
      </DataFormCard>
    </form>
  );
}

export default CreateDataCard;
