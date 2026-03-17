import GroupEntranceLayout from './components/GroupEntranceLayout';

type GroupEntrancePageProps = {
  onGroupEntryClick?: () => void;
};

function GroupEntrancePage({ onGroupEntryClick }: GroupEntrancePageProps) {
  return <GroupEntranceLayout onGroupEntryClick={onGroupEntryClick} />;
}

export default GroupEntrancePage;
