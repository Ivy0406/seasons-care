import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import {
  DataCardSummary,
  DataCardBloodPressure,
  DataCardOxygen,
  DataCardTemperature,
  DataCardWeight,
  DataCardBloodSugar,
} from '@/components/common/DataCard';

import useHealth from './useHealth';

const swiperConfig = {
  spaceBetween: 16,
  slidesPerView: 1,
  pagination: {
    el: '.custom-pagination',
    clickable: true,
    renderBullet(_index: number, className: string) {
      return `<span class="${className} transition-all duration-300"></span>`;
    },
  },
};

function HealthSummary() {
  const navigate = useNavigate();
  const { bloodPressure } = useHealth();

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">健康摘要</h2>
        <CircleButtonPrimary
          size="md"
          aria-label="查看AI健康報告"
          onClick={() => navigate('/health-report')}
        >
          <Plus />
        </CircleButtonPrimary>
      </div>
      <Swiper
        modules={[Pagination]}
        {...swiperConfig}
        className="h-40 w-full [--swiper-pagination-bottom:8px] [--swiper-theme-color:var(--color-neutral-900)]"
      >
        <SwiperSlide>
          <DataCardSummary
            category="AI分析摘要"
            className="w-full"
            content="--"
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-full gap-3">
            <DataCardBloodPressure
              category="血壓"
              systolic={bloodPressure.systolic}
              diastolic={bloodPressure.diastolic}
              className="flex-1"
              time={bloodPressure.time}
            />
            <DataCardOxygen
              category="血氧"
              bloodOxygen="--"
              className="flex-1"
              time="--"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-full gap-3">
            <DataCardTemperature
              category="體溫"
              temperature="--"
              className="flex-1"
              time="--"
            />
            <DataCardWeight
              category="體重"
              weight="--"
              className="flex-1"
              time="--"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <DataCardBloodSugar
            category="血糖"
            morning="--"
            noon="--"
            night="--"
            className="h-full w-full"
            time="--"
          />
        </SwiperSlide>
      </Swiper>
      <div className="custom-pagination mt-3 flex justify-center gap-2" />
    </section>
  );
}

export default HealthSummary;
