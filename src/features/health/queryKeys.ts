const healthKeys = {
  all: ['health'] as const,
  bloodPressure: (careGroupId: string) =>
    ['health', careGroupId, 'blood-pressure'] as const,
  bloodOxygen: (careGroupId: string) =>
    ['health', careGroupId, 'blood-oxygen'] as const,
  temperature: (careGroupId: string) =>
    ['health', careGroupId, 'temperature'] as const,
  weight: (careGroupId: string) => ['health', careGroupId, 'weight'] as const,
  bloodSugar: (careGroupId: string) =>
    ['health', careGroupId, 'blood-sugar'] as const,
  weeklyInsight: (careGroupId: string) =>
    ['health', careGroupId, 'weekly-insight'] as const,
  todayInsight: (careGroupId: string) =>
    ['health', careGroupId, 'today-insight'] as const,
  trendOverview: (careGroupId: string) =>
    ['health', careGroupId, 'trend-overview'] as const,
};

export default healthKeys;
