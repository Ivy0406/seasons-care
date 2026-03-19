import { Swiper, SwiperSlide } from 'swiper/react';

import {
  DataCardSummary,
  DataCardBloodPressure,
  DataCardOxygen,
  DataCardTemperature,
  DataCardWeight,
  DataCardBloodSugar,
} from '@/components/common/DataCard';

function HealthSummary() {
  return (
    <section>
      <div>
        <h2>健康摘要</h2>
      </div>
      <Swiper>
        <SwiperSlide>
          <DataCardSummary category="AI分析摘要" />
          <DataCardBloodPressure
            category="血壓"
            systolic={120}
            diastolic={80}
          />
          <DataCardOxygen category="血氧" bloodOxygen={95} />
          <DataCardTemperature category="體溫" temperature={36.5} />
          <DataCardWeight category="體重" weight={60} />
          <DataCardBloodSugar
            category="血糖"
            morning={100}
            noon={120}
            night={140}
          />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default HealthSummary;
