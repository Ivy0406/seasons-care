import { useEffect, useState } from 'react';

import { format, isSameDay, isValid, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useLocation } from 'react-router';
import { toast } from 'sonner';

import Calendar from '@/components/common/Calendar';
import FixedBottomButton from '@/components/common/FixedBottomButton';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import useUpdateEventSeries from '@/features/calendar/hooks/useUpdateEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import CareLogDiarySection from '@/pages/CareLog/components/CareLogDiarySection';
import CreateCareLogDialog from '@/pages/CareLog/components/CreateCareLogDialog';
import useDeleteCareLogEntry from '@/pages/CareLog/hooks/useDeleteCareLogEntry';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';
import useUpdateCareLogEntry from '@/pages/CareLog/hooks/useUpdateCareLogEntry';
import type { CareLogEntry } from '@/pages/CareLog/types';
import createDraftCareLogEntry from '@/pages/CareLog/utils/createDraftCareLogEntry';

const defaultSelectedDate = new Date();

function getSelectedDateFromState(state: unknown) {
  if (!state || typeof state !== 'object' || !('selectedDate' in state)) {
    return undefined;
  }

  const { selectedDate } = state as { selectedDate?: unknown };

  if (selectedDate instanceof Date) {
    return isValid(selectedDate) ? selectedDate : undefined;
  }

  if (typeof selectedDate !== 'string') {
    return undefined;
  }

  const parsedDate = parseISO(selectedDate);

  return isValid(parsedDate) ? parsedDate : undefined;
}

function CalendarPage() {
  const location = useLocation();
  const { isLoading: isDeletingEntry, handleDeleteCareLogEntry } =
    useDeleteCareLogEntry();
  const { isLoading: isUpdatingCareLog, handleUpdateCareLogEntry } =
    useUpdateCareLogEntry();
  const { isLoading: isUpdatingEventSeries, handleUpdateEventSeries } =
    useUpdateEventSeries();
  const { entries: fetchedEntries, refetchEntries } = useGetCareLogEntries();
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const initialSelectedDate = getSelectedDateFromState(location.state);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSelectedDate ?? defaultSelectedDate,
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    initialSelectedDate ?? defaultSelectedDate,
  );
  const { eventSeries, refetch: refetchEventSeries } =
    useGetEventSeries(visibleMonth);
  const [creatingEntry, setCreatingEntry] = useState<CareLogEntry | null>(null);

  useEffect(() => {
    const routedSelectedDate = getSelectedDateFromState(location.state);

    if (!routedSelectedDate) {
      return;
    }

    setSelectedDate(routedSelectedDate);
    setVisibleMonth(routedSelectedDate);
  }, [location.state]);

  const recurringEntries = toEventSeriesEntries(
    eventSeries,
    visibleMonth,
    groupMembers,
  );
  const allEntries = [...fetchedEntries, ...recurringEntries];
  const markedDates = allEntries.map((entry) => parseISO(entry.startsAt));
  const selectedEntries =
    selectedDate === undefined
      ? []
      : allEntries.filter((entry) =>
          isSameDay(parseISO(entry.startsAt), selectedDate),
        );
  const openCreateEntry = (date?: Date) => {
    setCreatingEntry(
      createDraftCareLogEntry(date ?? selectedDate ?? new Date()),
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col pb-10 text-neutral-900">
      <PageNavigationBar
        className="sticky top-0 z-10 border-0 bg-neutral-200 px-6"
        title="日誌"
        onMenuClick={() => setIsSideMenuOpen(true)}
      />

      <section className="bg-primary-default border-y border-neutral-900">
        <div className="mx-auto w-full max-w-200 px-4 py-5">
          <Calendar
            mode="single"
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              if (date) setVisibleMonth(date);
            }}
            markedDates={markedDates}
            formatters={{
              formatCaption: (date: Date) =>
                format(date, 'yyyy.MM', { locale: zhTW }),
            }}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-200 bg-neutral-200 px-6 py-6">
        <CareLogDiarySection
          items={selectedEntries}
          selectedDate={selectedDate}
          onCreateEntry={openCreateEntry}
          isUpdatingEntry={isUpdatingCareLog || isUpdatingEventSeries}
          isDeletingEntry={isDeletingEntry}
          onToggleStatus={async (entryId, status) => {
            const targetEntry = fetchedEntries.find(
              (entry) => entry.id === entryId,
            );

            if (!targetEntry) {
              toast.error('重複事件目前不支援在這裡變更完成狀態');
              return false;
            }

            const persistedEntry = await handleUpdateCareLogEntry({
              ...targetEntry,
              status,
            });

            if (persistedEntry === null) {
              return false;
            }

            await refetchEntries();

            return true;
          }}
          onUpdateEntry={async (updatedEntry) => {
            if (updatedEntry.sourceType === 'event-series') {
              const persistedEntry =
                await handleUpdateEventSeries(updatedEntry);

              if (persistedEntry === null) {
                return false;
              }

              await refetchEventSeries();
              return true;
            }

            const persistedEntry = await handleUpdateCareLogEntry(updatedEntry);

            if (persistedEntry === null) {
              return false;
            }

            await refetchEntries();

            return true;
          }}
          onDeleteEntry={async (entryId) => {
            if (entryId.includes('__')) {
              toast.error('重複事件目前不支援在這裡刪除');
              return false;
            }

            const didDelete = await handleDeleteCareLogEntry(entryId);

            if (!didDelete) {
              return false;
            }

            const nextEntries = await refetchEntries();
            return !nextEntries.some((entry) => entry.id === entryId);
          }}
        />
      </section>

      <FixedBottomButton
        onClick={() => openCreateEntry(new Date())}
        label="新增"
      />

      <CreateCareLogDialog
        entry={creatingEntry}
        onClose={() => setCreatingEntry(null)}
        onCreated={async (createdEntry) => {
          const createdDate = parseISO(createdEntry.startsAt);

          setSelectedDate(createdDate);
          setVisibleMonth(createdDate);
          await refetchEntries();
        }}
      />

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
    </main>
  );
}

export default CalendarPage;
