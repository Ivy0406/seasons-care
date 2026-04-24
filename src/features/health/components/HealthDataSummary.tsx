import {
  DataCardBloodPressure,
  DataCardOxygen,
  DataCardTemperature,
  DataCardWeight,
  DataCardBloodSugar,
} from '@/components/common/DataCard';

import useHealth from '../useHealth';

function HealthDataSummary() {
  const healthData = useHealth();

  const { bloodPressure, temperature, bloodOxygen, weight, bloodSugar } =
    healthData;

  return (
    <section className="grid grid-cols-2 gap-3">
      <DataCardBloodPressure
        category="血壓"
        systolic={bloodPressure.systolic}
        diastolic={bloodPressure.diastolic}
        className="h-full w-full"
        time={bloodPressure.time}
      />

      <DataCardOxygen
        category="血氧"
        bloodOxygen={bloodOxygen.spO2}
        className="h-full w-full"
        time={bloodOxygen.time}
      />

      <DataCardTemperature
        category="體溫"
        temperature={temperature.value}
        className="h-full w-full"
        time={temperature.time}
      />

      <DataCardWeight
        category="體重"
        weight={weight.value}
        className="h-full w-full"
        time={weight.time}
      />

      <DataCardBloodSugar
        category="血糖"
        morning={bloodSugar.morning}
        noon={bloodSugar.noon}
        night={bloodSugar.night}
        className="col-span-2 h-full w-full"
        time=""
      />

      <div className="custom-pagination col-span-2 mt-3 flex justify-center gap-2" />
    </section>
  );
}

export default HealthDataSummary;
