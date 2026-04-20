import { Sparkles } from 'lucide-react';

import cn from '@/lib/utils';

import { CardLabelPrimary } from './CardLabel';

type Measurement = number | '--';

type DataCardBaseProps = {
  category: string;
  time?: string;
  className?: string;
};

type SummaryCardProps = Omit<DataCardBaseProps, 'time'> & {
  content: string;
};
type BloodPressureCardProps = DataCardBaseProps & {
  systolic: Measurement;
  diastolic: Measurement;
};
type TemperatureCardProps = DataCardBaseProps & {
  temperature: Measurement;
};
type OxygenCardProps = DataCardBaseProps & {
  bloodOxygen: Measurement;
};
type WeightCardProps = DataCardBaseProps & { weight: Measurement };
type BloodSugarCardProps = DataCardBaseProps & {
  morning: Measurement;
  noon: Measurement;
  night: Measurement;
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
        'flex min-h-40 w-fit flex-col gap-2 rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 py-3',
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

function DataCardSummary({ category, className, content }: SummaryCardProps) {
  return (
    <div
      className={cn(
        'flex h-40 w-fit flex-col gap-2 rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 py-3',
        className,
      )}
    >
      <div className="flex h-9 w-full justify-between border-b border-neutral-900 pb-2">
        <CardLabelPrimary>{category}</CardLabelPrimary>
      </div>
      <div className="flex gap-1.5">
        <Sparkles size={16} className="mt-1 shrink-0" />
        <p className="font-paragraph-md pb-4 text-justify leading-relaxed text-neutral-900">
          {content}
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
    <BaseCard category={category} time={time} className={className}>
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
