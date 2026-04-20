import type { Point } from '@/types/health-dashboard';

import useGetTrendOverview from '../hooks/useGetTrendOverview';

import HealthDataChartCard, {
  type SparklinePoint,
} from './HealthDataChartCard';

function toSparkline(points: Point[]): SparklinePoint[] {
  return points
    .filter((p): p is { date: string; value: number } => p.value !== null)
    .map((p) => ({ day: p.date, value: p.value }));
}

function hasEnoughPoints(points: Point[]): boolean {
  return toSparkline(points).length >= 2;
}

function WeeklyHealthTrend() {
  const { data } = useGetTrendOverview();

  const bp = data?.blood_pressure;
  const bo = data?.blood_oxygen;
  const bs = data?.blood_sugar;
  const temp = data?.temperature;
  const wt = data?.weight;

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
          title={bp?.title ?? '血壓'}
          status={
            bp && hasEnoughPoints(bp.points) ? bp.statusLabel : '目前無趨勢'
          }
          systolic={bp?.averageValue ?? '--'}
          diastolic={bp?.secondaryAverageValue ?? '--'}
          sparklineData={bp ? toSparkline(bp.points) : undefined}
        />
        <HealthDataChartCard
          title={bo?.title ?? '血氧'}
          status={
            bo && hasEnoughPoints(bo.points) ? bo.statusLabel : '目前無趨勢'
          }
          value={bo?.averageValue ?? '--'}
          unit={bo?.unit ?? '%'}
          sparklineData={bo ? toSparkline(bo.points) : undefined}
        />
        <HealthDataChartCard
          title={bs?.title ?? '血糖'}
          status={
            bs && hasEnoughPoints(bs.points) ? bs.statusLabel : '目前無趨勢'
          }
          value={bs?.averageValue ?? '--'}
          unit={bs?.unit ?? 'mg/dL'}
          sparklineData={bs ? toSparkline(bs.points) : undefined}
        />
        <HealthDataChartCard
          title={temp?.title ?? '體溫'}
          status={
            temp && hasEnoughPoints(temp.points)
              ? temp.statusLabel
              : '目前無趨勢'
          }
          value={temp?.averageValue ?? '--'}
          unit={temp?.unit ?? '°C'}
          sparklineData={temp ? toSparkline(temp.points) : undefined}
        />
        <HealthDataChartCard
          title={wt?.title ?? '體重'}
          status={
            wt && hasEnoughPoints(wt.points) ? wt.statusLabel : '目前無趨勢'
          }
          value={wt?.averageValue ?? '--'}
          unit={wt?.unit ?? 'kg'}
          sparklineData={wt ? toSparkline(wt.points) : undefined}
        />
      </div>
    </section>
  );
}

export default WeeklyHealthTrend;
