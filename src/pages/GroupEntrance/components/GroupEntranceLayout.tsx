import { PageNavigationBar } from '@/components/common/NavigationBar';
import GroupEntryCard from '@/features/groups/components/GroupEntryCard';

type GroupEntranceLayoutProps = {
  onGroupEntryClick?: () => void;
};

function GroupEntranceLayout({ onGroupEntryClick }: GroupEntranceLayoutProps) {
  return (
    <>
      <PageNavigationBar
        showTitle={false}
        showMenuButton={false}
        centerBrandLinkToHomepage={false}
      />
      <main className="flex w-full flex-1 flex-col items-center justify-center px-6 pb-10">
        <section className="flex flex-col gap-6 text-left text-neutral-900">
          <GroupEntryCard onActionClick={onGroupEntryClick} />
        </section>
      </main>
    </>
  );
}

export default GroupEntranceLayout;
