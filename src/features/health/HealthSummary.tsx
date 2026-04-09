import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import {
  DataCardBloodPressure,
  DataCardOxygen,
  DataCardTemperature,
  DataCardWeight,
  DataCardBloodSugar,
} from '@/components/common/DataCard';

import useHealth from './useHealth';

// slidesOffsetBefore/After 對應父層 TabsContent 的 px-6（24px）
const swiperConfig = {
  spaceBetween: 12,
  slidesPerView: 'auto' as const,
  slidesOffsetBefore: 24,
  slidesOffsetAfter: 24,
  pagination: {
    el: '.custom-pagination',
    clickable: true,
    renderBullet(_index: number, className: string) {
      return `<span class="${className} transition-all duration-300"></span>`;
    },
  },
};

function HealthSummary() {
  const healthData = useHealth();

  const { bloodPressure, temperature, bloodOxygen, weight, bloodSugar } =
    healthData;

  return (
    <section className="pt-3">
      <Swiper
        modules={[Pagination]}
        {...swiperConfig}
        className="h-40 w-full [--swiper-pagination-bottom:8px] [--swiper-theme-color:var(--color-neutral-100)]"
      >
        <SwiperSlide style={{ width: '166px' }}>
          <DataCardBloodPressure
            category="血壓"
            systolic={bloodPressure.systolic}
            diastolic={bloodPressure.diastolic}
            className="h-full w-full"
            time={bloodPressure.time}
          />
        </SwiperSlide>
        <SwiperSlide style={{ width: '166px' }}>
          <DataCardOxygen
            category="血氧"
            bloodOxygen={bloodOxygen.spO2}
            className="h-full w-full"
            time={bloodOxygen.time}
          />
        </SwiperSlide>
        <SwiperSlide style={{ width: '166px' }}>
          <DataCardTemperature
            category="體溫"
            temperature={temperature.value}
            className="h-full w-full"
            time={temperature.time}
          />
        </SwiperSlide>
        <SwiperSlide style={{ width: '166px' }}>
          <DataCardWeight
            category="體重"
            weight={weight.value}
            className="h-full w-full"
            time={weight.time}
          />
        </SwiperSlide>
        <SwiperSlide style={{ width: '250px' }}>
          <DataCardBloodSugar
            category="血糖"
            morning={bloodSugar.morning}
            noon={bloodSugar.noon}
            night={bloodSugar.night}
            className="h-full w-full"
            time=""
          />
        </SwiperSlide>
      </Swiper>
      <div className="custom-pagination mt-3 flex justify-center gap-2" />
    </section>
  );
}

export default HealthSummary;
