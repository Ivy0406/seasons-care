const calendarKeys = {
  all: ['calendar'] as const,
  eventSeries: (careGroupId: string, from: string, to: string) =>
    [...calendarKeys.all, 'event-series', careGroupId, from, to] as const,
};

export default calendarKeys;
