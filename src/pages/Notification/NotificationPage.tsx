import { useEffect, useMemo, useState } from 'react';

import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns';
import { Calendar, Check, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router';

import BaseDrawer from '@/components/common/BaseDrawer';
import { NavigationGroupTrigger } from '@/components/common/NavigationBar';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import useExpenses from '@/features/money/hooks/useExpenses';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';

import NotificationBar from './components/NotificationBar';
import SplitExpenseBar from './components/SplitExpenseBar';
import useNotificationBadge from './hooks/useNotificationBadge';

function NotificationPage() {
  const navigate = useNavigate();
  const { markAsRead } = useNotificationBadge();
  const { currentGroupId, setCurrentGroupId } = useCurrentGroupId();

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);
  const { data: groups = [] } = useGetGroups();
  const { entries } = useGetCareLogEntries();
  const { expenses: thisMonthExpenses } = useExpenses(
    format(new Date(), 'yyyy-MM'),
  );
  const { expenses: nextMonthExpenses } = useExpenses(
    format(addDays(new Date(), 7), 'yyyy-MM'),
  );
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);

  const currentGroup = groups.find((g) => g.id === currentGroupId) ?? groups[0];

  const { pendingImportantEntries, completedImportantEntries } = useMemo(() => {
    const today = new Date();
    const todayImportant = entries
      .filter(
        (entry) =>
          entry.isImportant && isSameDay(parseISO(entry.startsAt), today),
      )
      .sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
      );
    return {
      pendingImportantEntries: todayImportant.filter(
        (entry) => entry.status === 'pending',
      ),
      completedImportantEntries: todayImportant.filter(
        (entry) => entry.status === 'completed',
      ),
    };
  }, [entries]);

  const allExpenses = useMemo(
    () => [
      ...thisMonthExpenses,
      ...nextMonthExpenses.filter(
        (expense) =>
          !thisMonthExpenses.some((existing) => existing.id === expense.id),
      ),
    ],
    [thisMonthExpenses, nextMonthExpenses],
  );

  const todaySplitExpenses = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return allExpenses.filter(
      (expense) =>
        expense.splitStatus === 'settled' &&
        expense.updatedAt.replace('Z', '').startsWith(todayStr),
    );
  }, [allExpenses]);

  const upcomingImportantEntries = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEnd = addDays(today, 7);
    return entries
      .filter((entry) => {
        const date = startOfDay(parseISO(entry.startsAt));
        return (
          entry.isImportant &&
          entry.status === 'pending' &&
          isAfter(date, today) &&
          isBefore(date, weekEnd)
        );
      })
      .sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
      );
  }, [entries]);

  const upcomingSplitExpenses = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEnd = addDays(today, 7);
    return allExpenses.filter((expense) => {
      const date = startOfDay(parseISO(expense.expenseDate.replace('Z', '')));
      return (
        expense.splitStatus === 'pending' &&
        isAfter(date, today) &&
        isBefore(date, weekEnd)
      );
    });
  }, [allExpenses]);

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
        <h2 className="font-label-lg flex py-3">今日</h2>
        {pendingImportantEntries.length === 0 &&
        completedImportantEntries.length === 0 &&
        todaySplitExpenses.length === 0 ? (
          <NotificationBar
            icon={<Calendar />}
            title="目前沒有收到任何通知"
            showChevron={false}
            iconClassName="bg-neutral-500 border-neutral-500"
          />
        ) : (
          <>
            {pendingImportantEntries.map((entry) => (
              <NotificationBar
                key={entry.id}
                icon={<Calendar />}
                eventType="重要任務"
                title={entry.title}
                time={format(parseISO(entry.startsAt), 'HH:mm')}
                onClick={() => {}}
              />
            ))}
            {completedImportantEntries.map((entry) => (
              <NotificationBar
                key={entry.id}
                icon={<Check />}
                eventType="已完成重要任務"
                title={entry.title}
                time={format(parseISO(entry.startsAt), 'HH:mm')}
                onClick={() => {}}
              />
            ))}
            {todaySplitExpenses.map((expense) => (
              <SplitExpenseBar
                key={expense.id}
                expense={expense}
                groupMembers={groupMembers}
                label="已執行分帳"
              />
            ))}
          </>
        )}
        <h2 className="font-label-lg flex py-3">其他</h2>
        {upcomingImportantEntries.length === 0 &&
        upcomingSplitExpenses.length === 0 ? (
          <NotificationBar
            icon={<ClipboardList />}
            title="近一週沒有其他通知"
            showChevron={false}
            iconClassName="bg-neutral-500 border-neutral-500"
          />
        ) : (
          <>
            {upcomingImportantEntries.map((entry) => (
              <NotificationBar
                key={entry.id}
                icon={<Calendar />}
                eventType="重要任務"
                title={entry.title}
                time={format(parseISO(entry.startsAt), 'MM/dd HH:mm')}
                onClick={() => {}}
              />
            ))}
            {upcomingSplitExpenses.map((expense) => (
              <SplitExpenseBar
                key={expense.id}
                expense={expense}
                groupMembers={groupMembers}
                label="待執行分帳"
              />
            ))}
          </>
        )}
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
