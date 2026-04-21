import { useState } from 'react';

import { format, isValid, parseISO } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
import useCreateCareLogEntry from '@/pages/CareLog/hooks/useCreateCareLogEntry';
import type { CareLogEntry } from '@/pages/CareLog/types';
import createDraftCareLogEntry from '@/pages/CareLog/utils/createDraftCareLogEntry';

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

function CareLogCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, handleCreateCareLogEntry } = useCreateCareLogEntry();
  const initialSelectedDate = getSelectedDateFromState(location.state);
  const [draftEntry] = useState<CareLogEntry>(() =>
    createDraftCareLogEntry(initialSelectedDate),
  );
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);
  const [createdEntry, setCreatedEntry] = useState<CareLogEntry | null>(null);

  const handleClose = () => {
    navigate('/calendar-page', {
      state: initialSelectedDate
        ? {
            selectedDate: format(
              initialSelectedDate,
              "yyyy-MM-dd'T'HH:mm:ssxxx",
            ),
          }
        : null,
    });
  };

  const handleCreate = async (entry: CareLogEntry) => {
    try {
      const createdCareLogEntry = await handleCreateCareLogEntry(entry);

      if (createdCareLogEntry === null) {
        setModalKey('createError');
        return;
      }

      setCreatedEntry(createdCareLogEntry);
      setModalKey('createSuccess');
    } catch {
      setModalKey('createError');
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-800 pb-10 text-neutral-50">
      <div className="relative flex items-center justify-center px-4 py-5">
        <button
          type="button"
          aria-label="返回日誌頁"
          className="absolute left-4 inline-flex size-10 items-center justify-center text-neutral-50"
          onClick={handleClose}
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <h1 className="font-label-lg">新增日誌</h1>
      </div>

      <section className="mx-auto w-full max-w-200 flex-1 px-4 pt-4">
        <CareLogFormCard
          entry={draftEntry}
          title="新增日誌"
          submitLabel="新增日誌"
          isSubmitting={isLoading}
          onClose={handleClose}
          onSubmit={handleCreate}
        />
      </section>

      {modalKey ? (
        <CareLogModal
          open
          variant={modalKey}
          onClose={() => {
            const nextSelectedDate = createdEntry?.startsAt;

            setModalKey(null);

            if (modalKey === 'createSuccess' && nextSelectedDate) {
              navigate('/calendar-page', {
                state: { selectedDate: nextSelectedDate },
              });
            }
          }}
        />
      ) : null}
    </main>
  );
}

export default CareLogCreatePage;
