import { Plus } from 'lucide-react';
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

const swiperConfig = {
  spaceBetween: 16,
  slidesPerView: 1,
  pagination: {
    el: '.custom-pagination',
    clickable: true,
    renderBullet(index: number, className: string) {
      return `<span class="${className} transition-all duration-300"></span>`;
    },
  },
};

function HealthSummary() {
  return (
    <section className="py-6">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-heading-md text-neutral-900">健康摘要</h2>
        <CircleButtonPrimary size="md" aria-label="查看更多">
          <Plus />
        </CircleButtonPrimary>
      </div>
      <Swiper
        modules={[Pagination]}
        {...swiperConfig}
        className="w-full pb-10 [--swiper-pagination-bottom:8px] [--swiper-theme-color:var(--color-neutral-900)]"
      >
        <SwiperSlide>
          <DataCardSummary
            category="AI分析摘要"
            className="h-44 w-full"
            time="14:00"
            content="下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成 80%，再加油一點點！"
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex gap-3">
            <DataCardBloodPressure
              category="血壓"
              systolic={120}
              diastolic={80}
              className="h-44 flex-1"
              time="14:00"
            />
            <DataCardOxygen
              category="血氧"
              bloodOxygen={95}
              className="h-44 flex-1"
              time="14:00"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex gap-3">
            <DataCardTemperature
              category="體溫"
              temperature={36.5}
              className="h-44 flex-1"
              time="14:00"
            />
            <DataCardWeight
              category="體重"
              weight={60}
              className="h-44 flex-1"
              time="14:00"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <DataCardBloodSugar
            category="血糖"
            morning={100}
            noon={120}
            night={140}
            className="h-44 w-full"
            time="14:00"
          />
        </SwiperSlide>
      </Swiper>
      <div className="custom-pagination mt-3 flex justify-center gap-2" />
    </section>
  );
}

export default HealthSummary;
