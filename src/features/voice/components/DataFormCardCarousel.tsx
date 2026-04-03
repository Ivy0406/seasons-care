import { useState } from 'react';

import { ChevronLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';
import {
  appendHealthRecord,
  createHealthRecordFromDraft,
} from '@/features/health/data/healthStorage';
import type { HealthDraft } from '@/features/health/types';
import {
  createEmptyHealthDraft,
  mergeHealthDraft,
} from '@/features/voice/services/healthParser';
import { useVoiceInput } from '@/features/voice/VoiceInputContext';

import DiaryDataFormCard from './DiaryDataFormCard';
import HealthDataFormCard from './HealthDataFormCard';
import MoneyDataFormCard from './MoneyDataFormCard';
import RecordingDrawer from './RecordingDrawer';

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

function hasHealthMetricValue(draft: HealthDraft) {
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);
  const [fallbackHealthDraft, setFallbackHealthDraft] = useState<HealthDraft>(
    createEmptyHealthDraft(),
  );
  const {
    activeKind,
    transcript,
    healthDraft,
    setHealthTranscript,
    updateHealthDraft,
    clearVoiceInput,
  } = useVoiceInput();

  const isHealthVoiceFlow = activeKind === 'health';
  const activeHealthDraft = isHealthVoiceFlow
    ? healthDraft
    : fallbackHealthDraft;
  const isLastSlide = activeIndex === 2;
  const isHealthSaveDisabled = !hasHealthMetricValue(activeHealthDraft);

  const handleHealthDraftChange = (updates: Partial<HealthDraft>) => {
    if (isHealthVoiceFlow) {
      updateHealthDraft(updates);
      return;
    }

    setFallbackHealthDraft((currentDraft) =>
      mergeHealthDraft(currentDraft, updates),
    );
  };

  const handleHealthSave = () => {
    try {
      const record = createHealthRecordFromDraft(activeHealthDraft);

      appendHealthRecord(record);
      setShowSuccessModal(true);
    } catch {
      setShowErrorModal(true);
    }
  };

  const handleCloseResultFlow = () => {
    setShowSuccessModal(false);
    clearVoiceInput();
    navigate('/homepage');
  };

  if (isHealthVoiceFlow) {
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
          <h1 className="font-label-lg text-neutral-50">健康語音結果</h1>
        </div>

        <div className="mt-6 flex-1 px-4">
          {transcript ? (
            <section className="mb-4 rounded-lg border-2 border-neutral-900 bg-neutral-100 p-4">
              <p className="font-label-md mb-2 text-neutral-900">語音內容</p>
              <p className="font-paragraph-md whitespace-pre-wrap text-neutral-700">
                {transcript}
              </p>
            </section>
          ) : null}

          <section className="bg-primary-default mb-4 rounded-lg border-2 border-neutral-900 p-4">
            <p className="font-label-md mb-2 text-neutral-900">解析摘要</p>
            <p className="font-paragraph-md text-neutral-900">
              {activeHealthDraft.summary}
            </p>
          </section>

          <HealthDataFormCard
            value={activeHealthDraft}
            onChange={handleHealthDraftChange}
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 px-4">
          <RoundedButtonSecondary
            className="h-12 min-w-32 border-neutral-50 bg-neutral-800 text-neutral-50 transition-colors duration-300 active:bg-neutral-50 active:text-neutral-800 disabled:border-neutral-500 disabled:text-neutral-500 disabled:active:bg-neutral-800 disabled:active:text-neutral-500"
            onClick={handleHealthSave}
            disabled={isHealthSaveDisabled}
          >
            儲存健康紀錄
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
            await setHealthTranscript(nextTranscript);
          }}
        />

        <Modal
          open={showSuccessModal}
          variant="success"
          title="新增成功！"
          autoCloseMs={1500}
          onClose={handleCloseResultFlow}
        />

        <Modal
          open={showErrorModal}
          variant="error"
          title="新增失敗！"
          onClose={() => {
            setShowErrorModal(false);
          }}
        />
      </div>
    );
  }

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
        <Swiper
          modules={[Pagination]}
          {...swiperConfig}
          onSwiper={setSwiper}
          onSlideChange={(slide) => setActiveIndex(slide.activeIndex)}
          className="w-full"
        >
          <SwiperSlide className="px-4">
            <HealthDataFormCard
              value={activeHealthDraft}
              onChange={handleHealthDraftChange}
            />
          </SwiperSlide>
          <SwiperSlide className="px-4">
            <DiaryDataFormCard />
          </SwiperSlide>
          <SwiperSlide className="px-4">
            <MoneyDataFormCard />
          </SwiperSlide>
        </Swiper>

        <div className="form-carousel-pagination mt-4 flex justify-center gap-2 px-4 [--swiper-pagination-bullet-inactive-color:#adb5bd] [--swiper-theme-color:#ffffff]" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 px-4">
        <RoundedButtonSecondary
          className="h-12 max-w-[97px] border-neutral-50 bg-neutral-800 text-neutral-50 transition-colors duration-300 active:bg-neutral-50 active:text-neutral-800"
          onClick={() => {
            if (isLastSlide) {
              setShowSuccessModal(true);
            } else {
              swiper?.slideNext();
            }
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
          await setHealthTranscript(nextTranscript);
        }}
      />

      <Modal
        open={showSuccessModal}
        variant="success"
        title="新增成功！"
        autoCloseMs={1500}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/homepage');
        }}
      />

      <Modal
        open={showErrorModal}
        variant="error"
        title="新增失敗！"
        onClose={() => {
          setShowErrorModal(false);
          navigate('/homepage');
        }}
      />
    </div>
  );
}

export default DataFormCardCarousel;
