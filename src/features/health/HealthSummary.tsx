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

type HealthData = {
  time: string | '';
  summary: { content: string };
  bloodPressure: { systolic: number | '--'; diastolic: number | '--' };
  temperature: number | '--';
  bloodOxygen: number | '--';
  weight: number | '--';
  bloodSugar: {
    morning: number | '--';
    noon: number | '--';
    night: number | '--';
  };
};

const mockHealthData: HealthData = {
  time: '10:00',
  summary: {
    content:
      '下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成 80%，再加油一點點！',
  },
  bloodPressure: { systolic: 142, diastolic: 92 },
  temperature: 36.5,
  bloodOxygen: 98,
  weight: 70.1,
  bloodSugar: { morning: 155, noon: 155, night: '--' },
};

function HealthSummary() {
  // 之後會換成自定義 Hook
  const healthData = mockHealthData;

  const {
    time,
    summary,
    bloodPressure,
    temperature,
    bloodOxygen,
    weight,
    bloodSugar,
  } = healthData;

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">健康摘要</h2>
        <CircleButtonPrimary size="md" aria-label="查看更多">
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
            content={summary.content}
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-full gap-3">
            <DataCardBloodPressure
              category="血壓"
              systolic={bloodPressure.systolic}
              diastolic={bloodPressure.diastolic}
              className="flex-1"
              time={time}
            />
            <DataCardOxygen
              category="血氧"
              bloodOxygen={bloodOxygen}
              className="flex-1"
              time={time}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-full gap-3">
            <DataCardTemperature
              category="體溫"
              temperature={temperature}
              className="flex-1"
              time={time}
            />
            <DataCardWeight
              category="體重"
              weight={weight}
              className="flex-1"
              time={time}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <DataCardBloodSugar
            category="血糖"
            morning={bloodSugar.morning}
            noon={bloodSugar.noon}
            night={bloodSugar.night}
            className="h-full w-full"
            time={time}
          />
        </SwiperSlide>
      </Swiper>
      <div className="custom-pagination mt-3 flex justify-center gap-2" />
    </section>
  );
}

export default HealthSummary;
