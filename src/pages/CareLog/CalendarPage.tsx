import { useState } from 'react';

import { format, isSameDay, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Plus } from 'lucide-react';

import Calendar from '@/components/common/Calendar';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import CareLogDiarySection from '@/pages/CareLog/components/CareLogDiarySection';
import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
import {
  getStoredCareLogEntries,
  saveCareLogEntries,
} from '@/pages/CareLog/data/careLogStorage';
import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';

const defaultSelectedDate = new Date();

const defaultParticipant = {
  id: 'current-user',
  name: '王希銘',
  src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
};

function createDraftCareLogEntry(selectedDate = new Date()): CareLogEntry {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `diary-${Date.now()}`,
    title: '',
    description: '',
    startsAt: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    repeatPattern: 'none',
    participants: [defaultParticipant],
    status: 'pending',
    isImportant: false,
  };
}

function CalendarPage() {
  const [entries, setEntries] = useState<CareLogEntry[]>(
    getStoredCareLogEntries,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultSelectedDate,
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(defaultSelectedDate);
  const [creatingEntry, setCreatingEntry] = useState<CareLogEntry | null>(null);
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);

  const markedDates = entries.map((entry) => parseISO(entry.startsAt));
  const selectedEntries =
    selectedDate === undefined
      ? []
      : entries.filter((entry) =>
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
        <div className="mx-auto flex w-full max-w-200 items-center justify-between px-6 py-3.75">
          <h2 className="font-heading-lg">日誌</h2>
          <button
            type="button"
            aria-label="新增日誌"
            className="inline-flex size-10 items-center justify-center text-neutral-900"
            onClick={() => openCreateEntry()}
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
          onCreateEntry={openCreateEntry}
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
                cardClassName="bg-primary-default"
                toneClassName="-mt-0.5 bg-primary-default text-neutral-900"
                footerMode="submitOnly"
                onClose={() => setCreatingEntry(null)}
                onVoiceInput={() => setShowRecordingDrawer(true)}
                onSubmit={(entry) => {
                  try {
                    const createdDate = parseISO(entry.startsAt);
                    const nextEntries = [entry, ...entries];

                    saveCareLogEntries(nextEntries);
                    setEntries(nextEntries);
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

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={() => setShowRecordingDrawer(false)}
      />

      {modalKey ? (
        <CareLogModal
          open
          variant={modalKey}
          onClose={() => setModalKey(null)}
        />
      ) : null}
    </main>
  );
}

export default CalendarPage;
