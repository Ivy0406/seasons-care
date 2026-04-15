import type {
  WeeklyInsightResponse,
  TodayInsightResponse,
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

export { getWeeklyInsight, getTodayInsight };
