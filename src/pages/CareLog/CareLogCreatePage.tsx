import { useState } from 'react';

import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import CareLogFormCard from '@/pages/CareLog/components/CareLogFormCard';
import CareLogModal, {
  type CareLogModalVariant,
} from '@/pages/CareLog/components/CareLogModal';
import {
  saveCareLogEntries,
  getStoredCareLogEntries,
} from '@/pages/CareLog/data/careLogStorage';
import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';

const defaultParticipant = {
  id: 'current-user',
  name: '王希銘',
  src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
};

function createDraftCareLogEntry(): CareLogEntry {
  const startsAt = new Date();

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `diary-${Date.now()}`,
    title: '',
    description: '',
    startsAt: format(startsAt, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    repeatPattern: 'none',
    participants: [defaultParticipant],
    status: 'pending',
    isImportant: false,
  };
}

function CareLogCreatePage() {
  const navigate = useNavigate();
  const [draftEntry] = useState<CareLogEntry>(createDraftCareLogEntry);
  const [modalKey, setModalKey] = useState<CareLogModalVariant | null>(null);
  const [createdEntry, setCreatedEntry] = useState<CareLogEntry | null>(null);

  const handleClose = () => {
    navigate('/calendar-page');
  };

  const handleCreate = (entry: CareLogEntry) => {
    try {
      const nextEntries = [entry, ...getStoredCareLogEntries()];

      saveCareLogEntries(nextEntries);
      setCreatedEntry(entry);
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
