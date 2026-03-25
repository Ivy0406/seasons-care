import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import cn from '@/lib/utils';

type SparklinePoint = { day: string; value: number };

type BaseProps = {
  title?: string;
  status?: string;
  sparklineData?: SparklinePoint[];
  chartDomain?: [number, number];
  className?: string;
};

type DualValueVariant = BaseProps & {
  systolic: number | '--';
  diastolic: number | '--';
  value?: never;
  unit?: never;
};

type SingleValueVariant = BaseProps & {
  value: number | string | '--';
  unit: string;
  systolic?: never;
  diastolic?: never;
};

type HealthDataChartCardProps = DualValueVariant | SingleValueVariant;

const DEFAULT_SPARKLINE: SparklinePoint[] = [
  { day: '週一', value: 25 },
  { day: '週二', value: 18 },
  { day: '週三', value: 8 },
  { day: '週四', value: 14 },
  { day: '週五', value: 28 },
  { day: '週六', value: 22 },
  { day: '週日', value: 18 },
];

function Sparkline({
  data,
  domain,
}: {
  data: SparklinePoint[];
  domain?: [number, number];
}) {
  return (
    <ResponsiveContainer width={120} height={40}>
      <LineChart data={data}>
        {domain && <YAxis domain={domain} hide />}
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary-default)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function HealthDataChartCard({
  title = '血壓',
  status = '維持良好',
  sparklineData = DEFAULT_SPARKLINE,
  chartDomain,
  className,
  ...rest
}: HealthDataChartCardProps) {
  const valueDisplay =
    'systolic' in rest ? (
      <p className="font-heading-lg text-neutral-900">
        {rest.systolic} / {rest.diastolic}
      </p>
    ) : (
      <p className="font-heading-lg text-neutral-900">{rest.value}</p>
    );

  const unit = 'unit' in rest ? rest.unit : 'mmHg';

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 py-4',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div>
            <p className="font-label-md text-neutral-900">{title}</p>
            <p className="font-paragraph-sm text-neutral-700">{status}</p>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            {valueDisplay}
            <p className="font-paragraph-sm text-neutral-700">{unit}</p>
          </div>
        </div>
        <div className="self-center">
          <Sparkline data={sparklineData} domain={chartDomain} />
        </div>
      </div>
    </div>
  );
}

export { type SparklinePoint };
export default HealthDataChartCard;
