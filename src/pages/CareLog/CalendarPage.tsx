import { useState } from 'react';

import { format, isSameDay, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import Calendar from '@/components/common/Calendar';
import CareLogDiarySection from '@/pages/CareLog/components/CareLogDiarySection';
import {
  getStoredCareLogEntries,
  saveCareLogEntries,
} from '@/pages/CareLog/data/careLogStorage';
import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';

type CalendarPageLocationState = {
  selectedDate?: string;
};

function CalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as
    | CalendarPageLocationState
    | null
    | undefined;
  const defaultSelectedDate =
    locationState?.selectedDate !== undefined
      ? parseISO(locationState.selectedDate)
      : new Date();
  const [entries, setEntries] = useState<CareLogEntry[]>(
    getStoredCareLogEntries,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultSelectedDate,
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(defaultSelectedDate);

  const markedDates = entries.map((entry) => parseISO(entry.startsAt));
  const selectedEntries =
    selectedDate === undefined
      ? []
      : entries.filter((entry) =>
          isSameDay(parseISO(entry.startsAt), selectedDate),
        );

  return (
    <main className="flex min-h-screen w-full flex-col pb-10 text-neutral-900">
      <section>
        <div className="mx-auto flex w-full max-w-200 items-center justify-between px-6 py-3.75">
          <h2 className="font-heading-lg">日誌</h2>
          <button
            type="button"
            aria-label="新增日誌"
            className="inline-flex size-10 items-center justify-center text-neutral-900"
            onClick={() => navigate('/calendar-page/new')}
          >
            <Plus className="size-8" strokeWidth={2} />
          </button>
        </div>
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
          onUpdateEntry={(updatedEntry) => {
            setEntries((currentEntries) => {
              const nextEntries = currentEntries.map((entry) =>
                entry.id === updatedEntry.id ? updatedEntry : entry,
              );

              saveCareLogEntries(nextEntries);
              return nextEntries;
            });
          }}
          onDeleteEntry={(entryId) => {
            setEntries((currentEntries) => {
              const nextEntries = currentEntries.filter(
                (entry) => entry.id !== entryId,
              );

              saveCareLogEntries(nextEntries);
              return nextEntries;
            });
          }}
        />
      </section>
    </main>
  );
}

export default CalendarPage;
