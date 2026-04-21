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
  sparklineData = [],
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
          {sparklineData.length >= 2 ? (
            <Sparkline data={sparklineData} domain={chartDomain} />
          ) : (
            <p className="font-paragraph-sm w-30 text-center text-neutral-500">
              目前沒有趨勢
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { type SparklinePoint };
export default HealthDataChartCard;
