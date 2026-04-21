import { useEffect, useState } from 'react';

import { format, isSameDay, isValid, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useLocation } from 'react-router';

import Calendar from '@/components/common/Calendar';
import FixedBottomButton from '@/components/common/FixedBottomButton';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import CareLogDiarySection from '@/pages/CareLog/components/CareLogDiarySection';
import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
import useCreateCareLogEntry from '@/pages/CareLog/hooks/useCreateCareLogEntry';
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
  const { isLoading, handleCreateCareLogEntry } = useCreateCareLogEntry();
  const { isLoading: isDeletingEntry, handleDeleteCareLogEntry } =
    useDeleteCareLogEntry();
  const { isLoading: isUpdatingEntry, handleUpdateCareLogEntry } =
    useUpdateCareLogEntry();
  const { entries: fetchedEntries, refetchEntries } = useGetCareLogEntries();
  const initialSelectedDate = getSelectedDateFromState(location.state);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSelectedDate ?? defaultSelectedDate,
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    initialSelectedDate ?? defaultSelectedDate,
  );
  const [creatingEntry, setCreatingEntry] = useState<CareLogEntry | null>(null);
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);

  useEffect(() => {
    const routedSelectedDate = getSelectedDateFromState(location.state);

    if (!routedSelectedDate) {
      return;
    }

    setSelectedDate(routedSelectedDate);
    setVisibleMonth(routedSelectedDate);
  }, [location.state]);

  const markedDates = fetchedEntries.map((entry) => parseISO(entry.startsAt));
  const selectedEntries =
    selectedDate === undefined
      ? []
      : fetchedEntries.filter((entry) =>
          isSameDay(parseISO(entry.startsAt), selectedDate),
        );
  const openCreateEntry = (date?: Date) => {
    setCreatingEntry(
      createDraftCareLogEntry(date ?? selectedDate ?? new Date()),
    );
  };

  return (
    <main className="flex min-h-screen w-full flex-col pb-10 text-neutral-900">
      <section>
        <PageNavigationBar
          wrapperClassName="border-b-0"
          className="px-4 ring-0"
          title="日誌"
          onMenuClick={() => setIsSideMenuOpen(true)}
        />
      </section>

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

      <section className="mx-auto w-full max-w-200 px-6 py-6">
        <CareLogDiarySection
          items={selectedEntries}
          selectedDate={selectedDate}
          onCreateEntry={openCreateEntry}
          isUpdatingEntry={isUpdatingEntry}
          isDeletingEntry={isDeletingEntry}
          onToggleStatus={async (entryId, status) => {
            const targetEntry = fetchedEntries.find(
              (entry) => entry.id === entryId,
            );

            if (!targetEntry) {
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
            const persistedEntry = await handleUpdateCareLogEntry(updatedEntry);

            if (persistedEntry === null) {
              return false;
            }

            await refetchEntries();

            return true;
          }}
          onDeleteEntry={async (entryId) => {
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

      <AlertDialog
        open={creatingEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingEntry(null);
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            {creatingEntry ? (
              <CareLogFormCard
                entry={creatingEntry}
                title="新日誌"
                submitLabel="新增日誌"
                isSubmitting={isLoading}
                cardClassName="bg-primary-default"
                toneClassName="-mt-0.5 bg-primary-default text-neutral-900"
                footerMode="submitOnly"
                onClose={() => setCreatingEntry(null)}
                onSubmit={async (entry) => {
                  try {
                    const createdEntry = await handleCreateCareLogEntry(entry);

                    if (createdEntry === null) {
                      setModalKey('createError');
                      return;
                    }

                    const createdDate = parseISO(createdEntry.startsAt);

                    await refetchEntries();
                    setSelectedDate(createdDate);
                    setVisibleMonth(createdDate);
                    setCreatingEntry(null);
                    setModalKey('createSuccess');
                  } catch {
                    setModalKey('createError');
                  }
                }}
              />
            ) : null}
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      {modalKey ? (
        <CareLogModal
          open
          variant={modalKey}
          onClose={() => setModalKey(null)}
        />
      ) : null}

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
    </main>
  );
}

export default CalendarPage;
