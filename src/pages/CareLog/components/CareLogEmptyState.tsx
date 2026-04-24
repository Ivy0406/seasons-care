import CreateEntryEmptyState from '@/components/common/CreateEntryEmptyState';

type CareLogEmptyStateProps = {
  message: string;
  onCreateEntry?: () => void;
  className?: string;
};

function CareLogEmptyState({
  message,
  onCreateEntry,
  className,
}: CareLogEmptyStateProps) {
  return (
    <CreateEntryEmptyState
      message={message}
      onCreateEntry={onCreateEntry}
      className={className}
    />
  );
}

export default CareLogEmptyState;
