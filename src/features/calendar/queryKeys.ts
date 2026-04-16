const calendarKeys = {
  all: ['calendar'] as const,
  eventSeries: (careGroupId: string) =>
    [...calendarKeys.all, 'event-series', careGroupId] as const,
};

export default calendarKeys;
