import HealthDataChartCard, {
  type SparklinePoint,
} from './HealthDataChartCard';

const TREND_DATA: {
  bloodPressure: {
    title: string;
    status: string;
    systolic: number | '--';
    diastolic: number | '--';
    sparklineData: SparklinePoint[];
    chartDomain: [number, number];
  };
  bloodOxygen: {
    title: string;
    status: string;
    value: number | '--';
    unit: string;
    sparklineData: SparklinePoint[];
  };
  bloodSugar: {
    title: string;
    status: string;
    value: number | '--';
    unit: string;
    sparklineData: SparklinePoint[];
    chartDomain: [number, number];
  };
  temperature: {
    title: string;
    status: string;
    value: number | '--';
    unit: string;
    sparklineData: SparklinePoint[];
  };
  weight: {
    title: string;
    status: string;
    value: number | '--';
    unit: string;
    sparklineData: SparklinePoint[];
  };
} = {
  bloodPressure: {
    title: '血壓',
    status: '建議觀察',
    systolic: 142,
    diastolic: 92,
    chartDomain: [115, 180],
    sparklineData: [
      { day: '週一', value: 135 },
      { day: '週二', value: 158 },
      { day: '週三', value: 142 },
      { day: '週四', value: 168 },
      { day: '週五', value: 145 },
      { day: '週六', value: 162 },
      { day: '週日', value: 142 },
    ],
  },
  bloodOxygen: {
    title: '血氧',
    status: '逐步改善',
    value: 98,
    unit: '%',
    sparklineData: [
      { day: '週一', value: 94 },
      { day: '週二', value: 95 },
      { day: '週三', value: 94 },
      { day: '週四', value: 96 },
      { day: '週五', value: 97 },
      { day: '週六', value: 97 },
      { day: '週日', value: 98 },
    ],
  },
  bloodSugar: {
    title: '血糖',
    status: '建議觀察',
    value: 155,
    unit: 'mg/dL',
    chartDomain: [120, 190],
    sparklineData: [
      { day: '週一', value: 138 },
      { day: '週二', value: 155 },
      { day: '週三', value: 178 },
      { day: '週四', value: 152 },
      { day: '週五', value: 185 },
      { day: '週六', value: 162 },
      { day: '週日', value: 155 },
    ],
  },
  temperature: {
    title: '體溫',
    status: '趨於穩定',
    value: 36.5,
    unit: '°C',
    sparklineData: [
      { day: '週一', value: 36.8 },
      { day: '週二', value: 36.6 },
      { day: '週三', value: 36.4 },
      { day: '週四', value: 36.7 },
      { day: '週五', value: 36.5 },
      { day: '週六', value: 36.5 },
      { day: '週日', value: 36.5 },
    ],
  },
  weight: {
    title: '體重',
    status: '維持良好',
    value: 70.1,
    unit: 'kg',
    sparklineData: [
      { day: '週一', value: 70.8 },
      { day: '週二', value: 70.6 },
      { day: '週三', value: 70.5 },
      { day: '週四', value: 70.4 },
      { day: '週五', value: 70.3 },
      { day: '週六', value: 70.2 },
      { day: '週日', value: 70.1 },
    ],
  },
};

function WeeklyHealthTrend() {
  const { bloodPressure, bloodOxygen, bloodSugar, temperature, weight } =
    TREND_DATA;

  return (
    <section className="pt-3">
      <div className="mb-3 pt-5">
        <p className="font-heading-sm text-neutral-900">近7天健康趨勢</p>
        <p className="font-paragraph-md text-neutral-700">
          以下顯示數值為近期平均數值。
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <HealthDataChartCard
          title={bloodPressure.title}
          status={bloodPressure.status}
          systolic={bloodPressure.systolic}
          diastolic={bloodPressure.diastolic}
          sparklineData={bloodPressure.sparklineData}
          chartDomain={bloodPressure.chartDomain}
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
          chartDomain={bloodSugar.chartDomain}
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
