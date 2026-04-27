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
import { toast } from 'sonner';

import BaseDrawer from '@/components/common/BaseDrawer';
import { NavigationGroupTrigger } from '@/components/common/NavigationBar';
import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import useExpenses from '@/features/money/hooks/useExpenses';
import useGetSplitRecord from '@/features/money/hooks/useGetSplitRecord';
import type { MemberSplit, SplitItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';

import NotificationBar from './components/NotificationBar';
import SplitExpenseBar from './components/SplitExpenseBar';
import SplitRecordDialog from './components/SplitRecordDialog';
import useNotificationBadge from './hooks/useNotificationBadge';

type SplitRecordState = {
  executedByName: string;
  executedAt: string;
  selectedItems: SplitItem[];
  memberSplits: MemberSplit[];
};

function NotificationPage() {
  const navigate = useNavigate();
  const { markAsRead } = useNotificationBadge();
  const { currentGroupId, setCurrentGroupId } = useCurrentGroupId();

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);
  const { data: groups = [] } = useGetGroups();
  const { entries } = useGetCareLogEntries();
  const { eventSeries: thisMonthEventSeries } = useGetEventSeries(new Date());
  const { eventSeries: nextMonthEventSeries } = useGetEventSeries(
    addDays(new Date(), 7),
  );
  const { expenses: thisMonthExpenses } = useExpenses(
    format(new Date(), 'yyyy-MM'),
  );
  const { expenses: nextMonthExpenses } = useExpenses(
    format(addDays(new Date(), 7), 'yyyy-MM'),
  );
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);
  const [splitRecordDialog, setSplitRecordDialog] = useState<{
    open: boolean;
    isLoading: boolean;
    record: SplitRecordState | null;
  }>({ open: false, isLoading: false, record: null });
  const { fetchRecord } = useGetSplitRecord();

  const recurringEntries = useMemo(
    () => [
      ...toEventSeriesEntries(thisMonthEventSeries, new Date(), groupMembers),
      ...toEventSeriesEntries(
        nextMonthEventSeries,
        addDays(new Date(), 7),
        groupMembers,
      ).filter(
        (entry) =>
          !thisMonthEventSeries.some(
            (eventSeries) =>
              `${eventSeries.eventSeriesId}__${eventSeries.scheduledAt ?? eventSeries.startsAt ?? ''}` ===
              entry.id,
          ),
      ),
    ],
    [groupMembers, nextMonthEventSeries, thisMonthEventSeries],
  );
  const allEntries = useMemo(
    () => [...entries, ...recurringEntries],
    [entries, recurringEntries],
  );

  const currentGroup = groups.find((g) => g.id === currentGroupId) ?? groups[0];

  const { pendingImportantEntries, completedImportantEntries } = useMemo(() => {
    const today = new Date();
    const todayImportant = allEntries
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
  }, [allEntries]);

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

  const todaySplitBatches = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const seen = new Set<string>();
    return allExpenses.filter(
      (expense): expense is typeof expense & { splitBatchId: string } => {
        if (
          expense.splitStatus !== 'settled' ||
          !expense.splitBatchId ||
          !expense.updatedAt.replace('Z', '').startsWith(todayStr)
        )
          return false;
        if (seen.has(expense.splitBatchId)) return false;
        seen.add(expense.splitBatchId);
        return true;
      },
    );
  }, [allExpenses]);

  const handleSplitBatchClick = async (splitBatchId: string) => {
    setSplitRecordDialog({ open: true, isLoading: true, record: null });
    const result = await fetchRecord(splitBatchId);
    if (result.success) {
      setSplitRecordDialog({
        open: true,
        isLoading: false,
        record: {
          executedByName: result.executedBy.name,
          executedAt: result.executedAt,
          selectedItems: result.selectedItems,
          memberSplits: result.memberSplits,
        },
      });
    } else {
      setSplitRecordDialog({ open: false, isLoading: false, record: null });
      toast.error(result.message);
    }
  };

  const upcomingImportantEntries = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEnd = addDays(today, 7);
    return allEntries
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
  }, [allEntries]);

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
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col bg-neutral-200 text-neutral-900">
      <NavigationGroupTrigger
        groupName={currentGroup?.name ?? ''}
        showBackButton
        onBackClick={() => navigate(-1)}
        onClick={() => setIsGroupDrawerOpen(true)}
        className="border-b-2 px-6 py-3.25"
        titleClassName="font-heading-sm"
      />

      <section className="flex flex-1 flex-col px-6">
        <h2 className="font-label-lg flex py-3">今日</h2>
        {pendingImportantEntries.length === 0 &&
        completedImportantEntries.length === 0 &&
        todaySplitBatches.length === 0 ? (
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
                onClick={() =>
                  navigate('/calendar-page', {
                    state: { selectedDate: entry.startsAt, entryId: entry.id },
                  })
                }
              />
            ))}
            {completedImportantEntries.map((entry) => (
              <NotificationBar
                key={entry.id}
                icon={<Check />}
                eventType="已完成重要任務"
                title={entry.title}
                time={format(parseISO(entry.startsAt), 'HH:mm')}
                onClick={() =>
                  navigate('/calendar-page', {
                    state: { selectedDate: entry.startsAt, entryId: entry.id },
                  })
                }
              />
            ))}
            {todaySplitBatches.map((expense) => (
              <SplitExpenseBar
                key={expense.splitBatchId}
                expense={expense}
                groupMembers={groupMembers}
                label="已執行分帳"
                onClick={() => handleSplitBatchClick(expense.splitBatchId)}
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
                onClick={() =>
                  navigate('/calendar-page', {
                    state: { selectedDate: entry.startsAt, entryId: entry.id },
                  })
                }
              />
            ))}
            {upcomingSplitExpenses.map((expense) => (
              <SplitExpenseBar
                key={expense.id}
                expense={expense}
                groupMembers={groupMembers}
                label="待執行分帳"
                onClick={() =>
                  navigate('/money', {
                    state: { date: expense.expenseDate, expenseId: expense.id },
                  })
                }
              />
            ))}
          </>
        )}
      </section>

      <SplitRecordDialog
        open={splitRecordDialog.open}
        onOpenChange={(open) =>
          setSplitRecordDialog((prev) => ({ ...prev, open }))
        }
        isLoading={splitRecordDialog.isLoading}
        executedByName={splitRecordDialog.record?.executedByName}
        selectedItems={splitRecordDialog.record?.selectedItems}
        memberSplits={splitRecordDialog.record?.memberSplits}
      />

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
