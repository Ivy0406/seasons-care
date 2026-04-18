import { useMemo, useState } from 'react';

import { format, isSameDay, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

import BaseDrawer from '@/components/common/BaseDrawer';
import { NavigationGroupTrigger } from '@/components/common/NavigationBar';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';

import NotificationBar from './components/NotificationBar';

function NotificationPage() {
  const navigate = useNavigate();
  const { currentGroupId, setCurrentGroupId } = useCurrentGroupId();
  const { data: groups = [] } = useGetGroups();
  const { entries } = useGetCareLogEntries();
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);

  const currentGroup = groups.find((g) => g.id === currentGroupId) ?? groups[0];

  const todayImportantEntries = useMemo(() => {
    const today = new Date();

    return entries.filter(
      (entry) => entry.isImportant && isSameDay(parseISO(entry.startsAt), today),
    );
  }, [entries]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col text-neutral-900">
      <NavigationGroupTrigger
        groupName={currentGroup?.name ?? ''}
        showBackButton
        onBackClick={() => navigate(-1)}
        onClick={() => setIsGroupDrawerOpen(true)}
        className="border-b-2 px-6 pb-3.25"
        titleClassName="font-heading-sm"
      />

      <section className="flex flex-1 flex-col px-6">
        <div className="font-label-lg flex py-3">今日</div>

        {todayImportantEntries.length === 0 ? (
          <p className="font-paragraph-sm text-neutral-500">今日沒有重要事件</p>
        ) : (
          todayImportantEntries.map((entry) => (
            <NotificationBar
              key={entry.id}
              icon={<Bell />}
              eventType="重要日誌"
              title={entry.title}
              time={format(parseISO(entry.startsAt), 'HH:mm')}
              onClick={() => {}}
            />
          ))
        )}

        <div className="font-label-lg flex py-3">其他</div>
      </section>

      <BaseDrawer open={isGroupDrawerOpen} onOpenChange={setIsGroupDrawerOpen}>
        <GroupManagementDrawer
          groups={groups}
          selectedGroupId={currentGroupId ?? ''}
          onSelectGroup={(groupId) => {
            setCurrentGroupId(groupId);
            setIsGroupDrawerOpen(false);
          }}
          onManageGroup={() => {}}
          onJoinGroup={() => {}}
          onCreateGroup={() => {}}
          showManageButton={false}
        />
      </BaseDrawer>
    </main>
  );
}

export default NotificationPage;
