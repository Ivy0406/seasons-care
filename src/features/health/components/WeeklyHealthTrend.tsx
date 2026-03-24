import HealthDataChartCard from './HealthDataChartCard';

const TREND_DATA = {
  bloodPressure: {
    title: '血壓',
    status: '維持良好',
    systolic: 142 as number | '--',
    diastolic: 92 as number | '--',
    sparklineData: [20, 28, 14, 32, 10, 24, 18, 30, 16, 26, 22, 28],
  },
  bloodOxygen: {
    title: '血氧',
    status: '逐步改善',
    value: 98 as number | '--',
    unit: '%',
    sparklineData: [18, 22, 15, 20, 18, 24, 22, 28, 25, 30, 28, 32],
  },
  bloodSugar: {
    title: '血糖',
    status: '建議觀察',
    value: 155 as number | '--',
    unit: 'mg/dL',
    sparklineData: [16, 18, 20, 22, 18, 24, 26, 28, 30, 28, 26, 24],
  },
  temperature: {
    title: '體溫',
    status: '趨於穩定',
    value: 36.5 as number | '--',
    unit: '°C',
    sparklineData: [20, 14, 10, 18, 22, 20, 26, 24, 28, 26, 24, 22],
  },
  weight: {
    title: '體重',
    status: '維持良好',
    value: 70.1 as number | '--',
    unit: 'kg',
    sparklineData: [22, 26, 28, 24, 20, 18, 22, 26, 28, 24, 20, 18],
  },
};

function WeeklyHealthTrend() {
  const { bloodPressure, bloodOxygen, bloodSugar, temperature, weight } =
    TREND_DATA;

  return (
    <section className="pt-3">
      <h2 className="font-heading-md mb-3 text-neutral-900">近7天健康趨勢</h2>
      <div className="flex flex-col gap-3">
        <HealthDataChartCard
          title={bloodPressure.title}
          status={bloodPressure.status}
          systolic={bloodPressure.systolic}
          diastolic={bloodPressure.diastolic}
          sparklineData={bloodPressure.sparklineData}
        />
        <HealthDataChartCard
          title={bloodOxygen.title}
          status={bloodOxygen.status}
          value={bloodOxygen.value}
          unit={bloodOxygen.unit}
          sparklineData={bloodOxygen.sparklineData}
        />
        <HealthDataChartCard
          title={bloodSugar.title}
          status={bloodSugar.status}
          value={bloodSugar.value}
          unit={bloodSugar.unit}
          sparklineData={bloodSugar.sparklineData}
        />
        <HealthDataChartCard
          title={temperature.title}
          status={temperature.status}
          value={temperature.value}
          unit={temperature.unit}
          sparklineData={temperature.sparklineData}
        />
        <HealthDataChartCard
          title={weight.title}
          status={weight.status}
          value={weight.value}
          unit={weight.unit}
          sparklineData={weight.sparklineData}
        />
      </div>
    </section>
  );
}

export default WeeklyHealthTrend;
