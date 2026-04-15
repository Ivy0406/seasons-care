type WeeklyInsightResponse = {
  success: boolean;
  message: string;
  data: {
    overallSummary: string;
    keyInsight: string;
    actionSuggestion: string;
    dateFrom: string;
    dateTo: string;
    isFromCache: boolean;
  };
  traceId: string;
};

type TodayInsightResponse = {
  success: boolean;
  message: string;
  data: {
    summary: string;
    hasTodayRecords: boolean;
    recordCount: number;
    latestRecordAt: string | null;
  };
  traceId: string;
};

type Point = {
  date: string;
  value: number | null;
};

type MetricTypeValue =
  | 'blood_pressure'
  | 'blood_oxygen'
  | 'blood_sugar'
  | 'temperature'
  | 'weight';

type MetricData = {
  metricType: MetricTypeValue;
  title: string;
  statusLabel: string;
  displayValue: string;
  unit: string;
  averageValue: number | null;
  secondaryAverageValue: number | null;
  points: Point[];
  secondaryPoints: Point[] | null;
};

type TrendOverviewResponse = {
  success: boolean;
  message: string;
  data: {
    dateFrom: string;
    dateTo: string;
    metrics: MetricData[];
  };
  traceId: string;
};

export type {
  WeeklyInsightResponse,
  TodayInsightResponse,
  Point,
  MetricTypeValue,
  MetricData,
  TrendOverviewResponse,
};
