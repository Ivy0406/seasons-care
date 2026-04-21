import type {
  WeeklyInsightResponse,
  TodayInsightResponse,
  TrendOverviewResponse,
} from '@/types/health-dashboard';

import apiClient from '../client';

const getWeeklyInsight = (careGroupId: string) => {
  return apiClient.get<WeeklyInsightResponse>(
    `/api/care-groups/${careGroupId}/health-dashboard/weekly-insight`,
  );
};

const getTodayInsight = (careGroupId: string) => {
  return apiClient.get<TodayInsightResponse>(
    `/api/care-groups/${careGroupId}/health-dashboard/today-insight`,
  );
};

const getTrendOverview = (careGroupId: string) => {
  return apiClient.get<TrendOverviewResponse>(
    `/api/care-groups/${careGroupId}/health-dashboard/trend-overview`,
  );
};

export { getWeeklyInsight, getTodayInsight, getTrendOverview };
