import { Sparkles } from 'lucide-react';

import cn from '@/lib/utils';

import { CardLabelPrimary } from './CardLabel';

type DataCardBaseProps = {
  category: 'AI分析摘要' | '血壓' | '體溫' | '血氧' | '體重' | '血糖';
  time?: string | '';
  className?: string;
};

type SummaryCardProps = DataCardBaseProps;
type BloodPressureCardProps = DataCardBaseProps & {
  systolic: number | '--';
  diastolic: number | '--';
};
type TemperatureCardProps = DataCardBaseProps & {
  temperature: number | '--';
};
type OxygenCardProps = DataCardBaseProps & {
  bloodOxygen: number | '--';
};
type WeightCardProps = DataCardBaseProps & { weight: number | '--' };
type BloodSugarCardProps = DataCardBaseProps & {
  morning: number | '--';
  noon: number | '--';
  night: number | '--';
};

function BaseCard({
  children,
  category,
  time,
  className,
}: DataCardBaseProps & { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex min-h-40 w-fit flex-col gap-2 rounded-[4px] border-2 border-neutral-900 bg-neutral-100 px-5 py-3',
        className,
      )}
    >
      <div className="item-center flex h-9 w-full justify-between gap-10 border-b border-neutral-900 pb-2">
        <CardLabelPrimary>{category}</CardLabelPrimary>
        <p className="font-paragraph-sm self-center text-neutral-900">{time}</p>
      </div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

function DataCardSummary({ category, time, className }: SummaryCardProps) {
  return (
    <div
      className={cn(
        'flex h-40 w-fit flex-col gap-2 rounded-[4px] border-2 border-neutral-900 bg-neutral-100 px-5 py-3',
        className,
      )}
    >
      <div className="flex h-9 w-full items-center justify-between border-b border-neutral-900">
        <CardLabelPrimary>{category}</CardLabelPrimary>
        <p className="font-paragraph-sm self-center text-neutral-900">{time}</p>
      </div>
      <div className="relative flex">
        <Sparkles size={16} className="absolute left-1" />
        <p className="font-paragraph-md pb-4 pl-8 text-neutral-900">
          下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成
          80%，再加油一點點！
        </p>
      </div>
    </div>
  );
}

function DataCardBloodPressure({
  category,
  time,
  className,
  systolic,
  diastolic,
}: BloodPressureCardProps) {
  return (
    <BaseCard category={category} time={time} className={className}>
      <div className="flex flex-col items-center justify-center">
        <p className="font-heading-lg text-neutral-900">
          {systolic} / {diastolic}
        </p>
        <p className="font-paragraph-sm text-neutral-900">mmHg</p>
      </div>
    </BaseCard>
  );
}

function DataCardTemperature({
  category,
  time,
  className,
  temperature,
}: TemperatureCardProps) {
  return (
    <BaseCard category={category} time={time} className={className}>
      <div className="flex items-baseline gap-1">
        <p className="font-heading-lg text-neutral-900">{temperature}</p>
        <p className="font-paragraph-md self-center text-neutral-900">°C</p>
      </div>
    </BaseCard>
  );
}

function DataCardOxygen({
  category,
  time,
  className,
  bloodOxygen,
}: OxygenCardProps) {
  return (
    <BaseCard category={category} time={time} className={className}>
      <div className="flex items-baseline gap-1">
        <p className="font-heading-lg text-neutral-900">{bloodOxygen}</p>
        <p className="font-paragraph-md self-center text-neutral-900">%</p>
      </div>
    </BaseCard>
  );
}

function DataCardWeight({
  category,
  time,
  className,
  weight,
}: WeightCardProps) {
  return (
    <BaseCard category={category} time={time} className={className}>
      <div className="flex items-baseline gap-1">
        <p className="font-heading-lg text-neutral-900">{weight}</p>
        <p className="font-paragraph-md self-center text-neutral-900">kg</p>
      </div>
    </BaseCard>
  );
}

function DataCardBloodSugar({
  category,
  time,
  className,
  morning,
  noon,
  night,
}: BloodSugarCardProps) {
  return (
    <BaseCard category={category} time={time} className={cn('w-64', className)}>
      <div className="grid w-full grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-2">
          <p className="font-paragraph-sm text-neutral-900">早上</p>
          <p className="font-heading-lg text-neutral-900">{morning}</p>
          <p className="font-paragraph-md text-neutral-900">mg/dL</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-paragraph-sm text-neutral-900">中午</p>
          <p className="font-heading-lg text-neutral-900">{noon}</p>
          <p className="font-paragraph-md text-neutral-900">mg/dL</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-paragraph-sm text-neutral-900">晚上</p>
          <p className="font-heading-lg text-neutral-900">{night}</p>
          <p className="font-paragraph-md text-neutral-900">mg/dL</p>
        </div>
      </div>
    </BaseCard>
  );
}

export {
  DataCardSummary,
  DataCardBloodPressure,
  DataCardTemperature,
  DataCardOxygen,
  DataCardWeight,
  DataCardBloodSugar,
};
