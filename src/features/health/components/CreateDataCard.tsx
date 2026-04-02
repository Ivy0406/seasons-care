import DataFormCard from '@/components/common/DataFormCard';
import Modal from '@/components/common/Modal';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import { HealthDataForm } from '@/components/common/SmallDataForm';
import VoiceCTA from '@/components/common/voiceCTA';
import useCreateHealthData from '@/features/health/hooks/useCreateHealthData';

type CreateDataCardProps = {
  onClose: () => void;
  onVoiceInput?: () => void;
};

function CreateDataCard({ onClose, onVoiceInput }: CreateDataCardProps) {
  const {
    register,
    handleSubmit,
    isLoading,
    recordDate,
    recordTime,
    modalState,
    closeModal,
  } = useCreateHealthData();

  return (
    <>
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
              onClose();
              onVoiceInput?.();
            }}
          />
          <HealthDataForm
            className="w-full border-0 bg-neutral-50 px-3 pt-3"
            register={register}
            recordDate={recordDate}
            recordTime={recordTime}
          />
        </DataFormCard.Content>
        <DataFormCard.Footer>
          <RoundedButtonPrimary
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            新增健康數值
          </RoundedButtonPrimary>
        </DataFormCard.Footer>
      </DataFormCard>
    </form>
    <Modal
      open={modalState.open}
      variant={modalState.variant}
      title={modalState.title}
      statusLayout="icon-first"
      autoCloseMs={modalState.variant === 'success' ? 1500 : undefined}
      onClose={closeModal}
    />
    </>
  );
}

export default CreateDataCard;
