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

export type { WeeklyInsightResponse, TodayInsightResponse };
