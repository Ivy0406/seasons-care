import { useState } from 'react';

import { ChevronLeft, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';

import DiaryDataFormCard from './DiaryDataFormCard';
import HealthDataFormCard from './HealthDataFormCard';
import MoneyDataFormCard from './MoneyDataFormCard';

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

function DataFormCardCarousel() {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isLastSlide = activeIndex === 2;

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
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className="w-full"
        >
          <SwiperSlide className="px-4">
            <HealthDataFormCard />
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
          onClick={() => navigate(-1)}
        >
          <RotateCw className="size-4" strokeWidth={2.5} />
          重新錄製
        </button>
      </div>

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
