import cn from '@/lib/utils';

type BaseProps = {
  title?: string;
  status?: string;
  sparklineData?: number[];
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

const DEFAULT_SPARKLINE = [25, 18, 8, 14, 28, 32, 22, 16, 20, 15, 22, 18];

function Sparkline({ data }: { data: number[] }) {
  const width = 120;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return [x, y] as [number, number];
  });

  const d = points.reduce((path, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = points[i - 1];
    const cpx = (px + x) / 2;
    return `${path} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
  }, '');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="var(--color-primary-default)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HealthDataChartCard({
  title = '血壓',
  status = '維持良好',
  sparklineData = DEFAULT_SPARKLINE,
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
        'flex flex-col justify-between rounded-xl border border-neutral-300 bg-neutral-50 px-5 py-4',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-label-md text-neutral-900">{title}</p>
          <p className="font-paragraph-sm text-neutral-500">{status}</p>
        </div>
        <Sparkline data={sparklineData} />
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        {valueDisplay}
        <p className="font-paragraph-sm text-neutral-600">{unit}</p>
      </div>
    </div>
  );
}

export default HealthDataChartCard;
