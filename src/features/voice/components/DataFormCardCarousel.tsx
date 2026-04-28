import { useState } from 'react';

import { ChevronLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';
import type { HealthDraft } from '@/features/health/types';
import type { MoneyDraft } from '@/features/money/types';
import useVoiceDraftSubmit from '@/features/voice/hooks/useVoiceDraftSubmit';
import {
  createEmptyDiaryDraft,
  hasDiaryDraftContent,
  mergeDiaryDraft,
} from '@/features/voice/services/diaryParser';
import {
  createEmptyHealthDraft,
  mergeHealthDraft,
} from '@/features/voice/services/healthParser';
import {
  createEmptyMoneyDraft,
  hasMoneyDraftContent,
  mergeMoneyDraft,
} from '@/features/voice/services/moneyParser';
import { useVoiceInput } from '@/features/voice/VoiceInputContext';
import type { DiaryDraft } from '@/pages/CareLog/types';

import DiaryDataFormCard from './DiaryDataFormCard';
import HealthDataFormCard from './HealthDataFormCard';
import MoneyDataFormCard from './MoneyDataFormCard';
import RecordingDrawer from './RecordingDrawer';
import VoiceTipCarousel from './VoiceTipCarousel';

import type { Swiper as SwiperClass } from 'swiper';

const swiperConfig = {
  spaceBetween: 16,
  slidesPerView: 1,
  pagination: {
    el: '.form-carousel-pagination',
    clickable: true,
    renderBullet(_index: number, className: string) {
      return `<span class="${className} transition-all duration-300 opacity-100! w-2 h-2"></span>`;
    },
  },
  noSwiping: false,
};

function hasHealthDraftContent(draft: HealthDraft) {
  return (
    draft.systolic.trim() !== '' ||
    draft.diastolic.trim() !== '' ||
    draft.temperature.trim() !== '' ||
    draft.bloodOxygen.trim() !== '' ||
    draft.weight.trim() !== '' ||
    draft.bloodSugar.trim() !== ''
  );
}

function DataFormCardCarousel() {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);
  const [fallbackHealthDraft, setFallbackHealthDraft] = useState<HealthDraft>(
    createEmptyHealthDraft(),
  );
  const [fallbackDiaryDraft, setFallbackDiaryDraft] = useState<DiaryDraft>(
    createEmptyDiaryDraft(),
  );
  const [fallbackMoneyDrafts, setFallbackMoneyDrafts] = useState<MoneyDraft[]>([
    createEmptyMoneyDraft(),
  ]);
  const {
    transcript,
    healthDraft,
    diaryDrafts,
    moneyDrafts,
    groupMembers,
    setVoiceTranscript,
    updateHealthDraft,
    updateDiaryDraft,
    updateMoneyDraft,
    clearVoiceInput,
  } = useVoiceInput();

  const hasVoiceTranscript = transcript.trim() !== '';
  const activeHealthDraft = hasVoiceTranscript
    ? healthDraft
    : fallbackHealthDraft;
  const activeDiaryDrafts = hasVoiceTranscript
    ? diaryDrafts
    : [fallbackDiaryDraft];
  const activeMoneyDrafts = hasVoiceTranscript
    ? moneyDrafts
    : fallbackMoneyDrafts;
  const shouldShowHealthForm = hasVoiceTranscript
    ? hasHealthDraftContent(activeHealthDraft)
    : true;
  const visibleDiaryDrafts = activeDiaryDrafts.filter((draft) =>
    hasDiaryDraftContent(draft),
  );
  const shouldShowDiaryForm = hasVoiceTranscript
    ? visibleDiaryDrafts.length > 0
    : true;
  let renderedDiaryDrafts = activeDiaryDrafts;

  if (hasVoiceTranscript) {
    renderedDiaryDrafts = visibleDiaryDrafts;
  }
  const visibleMoneyDrafts = hasVoiceTranscript
    ? activeMoneyDrafts.filter(hasMoneyDraftContent)
    : activeMoneyDrafts;
  const shouldShowMoneyForm = hasVoiceTranscript
    ? visibleMoneyDrafts.length > 0
    : true;

  const handleHealthDraftChange = (updates: Partial<HealthDraft>) => {
    if (hasVoiceTranscript) {
      updateHealthDraft(updates);
      return;
    }

    setFallbackHealthDraft((currentDraft) =>
      mergeHealthDraft(currentDraft, updates),
    );
  };

  const handleDiaryDraftChange = (id: string, updates: Partial<DiaryDraft>) => {
    if (hasVoiceTranscript) {
      updateDiaryDraft(id, updates);
      return;
    }

    setFallbackDiaryDraft((currentDraft) =>
      currentDraft.id === id
        ? mergeDiaryDraft(currentDraft, updates)
        : currentDraft,
    );
  };

  const handleMoneyDraftChange = (
    index: number,
    updates: Partial<MoneyDraft>,
  ) => {
    if (hasVoiceTranscript) {
      updateMoneyDraft(index, updates);
      return;
    }

    setFallbackMoneyDrafts((currentDrafts) =>
      currentDrafts.map((draft, i) =>
        i === index ? mergeMoneyDraft(draft, updates) : draft,
      ),
    );
  };

  const visibleSlides = [
    shouldShowHealthForm
      ? {
          key: 'health',
          content: (
            <HealthDataFormCard
              value={activeHealthDraft}
              onChange={handleHealthDraftChange}
            />
          ),
        }
      : null,
    ...(shouldShowDiaryForm
      ? renderedDiaryDrafts.map((draft, index) => ({
          key: `diary-${draft.id}`,
          content: (
            <DiaryDataFormCard
              title={`新任務 ${index + 1}`}
              value={draft}
              onChange={(updates) => handleDiaryDraftChange(draft.id, updates)}
              groupMembers={groupMembers}
              participantIds={draft.participantIds}
              onParticipantsChange={(participantIds) =>
                handleDiaryDraftChange(draft.id, { participantIds })
              }
            />
          ),
        }))
      : []),
    ...(shouldShowMoneyForm
      ? visibleMoneyDrafts.map((draft, index) => ({
          key: `money-${index}`,
          content: (
            <MoneyDataFormCard
              value={draft}
              onChange={(updates) => handleMoneyDraftChange(index, updates)}
            />
          ),
        }))
      : []),
  ].filter((slide) => slide !== null);

  const isLastSlide = activeIndex === visibleSlides.length - 1;

  const { isSubmitting, handleSaveAll } = useVoiceDraftSubmit({
    healthDraft: activeHealthDraft,
    diaryDrafts: renderedDiaryDrafts,
    moneyDrafts: visibleMoneyDrafts,
    groupMembers,
    shouldSubmitHealth: shouldShowHealthForm,
    shouldSubmitMoney: shouldShowMoneyForm,
    onSuccess: () => setShowSuccessModal(true),
  });

  const handleCloseResultFlow = () => {
    setShowSuccessModal(false);
    clearVoiceInput();
    navigate('/homepage');
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-800 pt-5 pb-10">
      <div className="relative flex items-center justify-center p-4 py-3">
        <button
          type="button"
          className="absolute left-4 flex items-center text-neutral-50"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-6" strokeWidth={2} />
        </button>
        <h1 className="font-label-lg text-neutral-50">錄製結果</h1>
      </div>

      <div className="mt-6 flex-1 overflow-hidden">
        <section className="mx-4 mb-4 rounded-md border-2 border-neutral-900 bg-neutral-100 p-2">
          <VoiceTipCarousel />
        </section>

        <Swiper
          modules={[Pagination]}
          {...swiperConfig}
          onSwiper={setSwiper}
          onSlideChange={(slide) => setActiveIndex(slide.activeIndex)}
          className="w-full"
        >
          {visibleSlides.map((slide) => (
            <SwiperSlide key={slide.key} className="px-4">
              {slide.content}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="form-carousel-pagination mt-4 flex justify-center gap-2 px-4 [--swiper-pagination-bullet-inactive-color:#adb5bd] [--swiper-theme-color:#ffffff]" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 px-4">
        <RoundedButtonSecondary
          className="h-12 max-w-[97px] border-neutral-50 bg-neutral-800 text-neutral-50 transition-colors duration-300 active:bg-neutral-50 active:text-neutral-800 disabled:opacity-50"
          disabled={isSubmitting}
          onClick={async () => {
            if (!isLastSlide) {
              swiper?.slideNext();
              return;
            }

            await handleSaveAll();
          }}
        >
          {isLastSlide ? '儲存全部' : '確認'}
        </RoundedButtonSecondary>

        <button
          type="button"
          className="font-label-sm flex items-center gap-2 px-4 py-2 text-neutral-50"
          onClick={() => setShowRecordingDrawer(true)}
        >
          <RotateCw className="size-4" strokeWidth={2.5} />
          重新錄製
        </button>
      </div>

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={async ({ transcript: nextTranscript }) => {
          const result = await setVoiceTranscript(nextTranscript);

          if (!result.hasDetectedContent) {
            clearVoiceInput();
            toast.error(
              '這段語音內容暫時無法辨識為健康、任務或帳目，請重新錄製或手動輸入。',
            );
            return { shouldClose: false };
          }

          return { shouldClose: true };
        }}
      />

      <Modal
        open={showSuccessModal}
        variant="success"
        title="新增成功！"
        autoCloseMs={1500}
        onClose={handleCloseResultFlow}
      />
    </div>
  );
}

export default DataFormCardCarousel;
