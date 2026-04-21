import GroupEntryCard from '@/features/groups/components/GroupEntryCard';

type GroupEntranceLayoutProps = {
  onGroupEntryClick?: () => void;
};

function GroupEntranceLayout({ onGroupEntryClick }: GroupEntranceLayoutProps) {
  return (
    <main className="flex w-full flex-1 flex-col pt-23.5 pb-10">
      <section className="flex flex-col gap-6 text-left text-neutral-900">
        <h1 className="font-heading-md mx-auto max-[390px]:text-[18px]">
          你現在尚未加入任何照護群組！
        </h1>
        <GroupEntryCard onActionClick={onGroupEntryClick} />
      </section>
    </main>
  );
}

export default GroupEntranceLayout;
