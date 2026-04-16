import type { CareLogPagination } from '@/types/careLog';

type EventSeriesRepeatPattern = 'none' | 'daily' | 'weeklyDay' | 'monthly';

type EventSeriesItem = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  repeatPattern: EventSeriesRepeatPattern;
  repeatInterval: number;
  daysOfWeek: number[];
  endType: number;
  endAt: string;
  occurrenceCount: number;
  participants: string[];
  status: string;
  isImportant: boolean;
  careGroupId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type EventSeriesApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  traceId: string;
  pagination?: CareLogPagination;
};

type CreateEventSeriesPayload = {
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  repeatPattern: EventSeriesRepeatPattern;
  repeatInterval: number;
  daysOfWeek: number[];
  endType: number;
  endAt: string;
  occurrenceCount: number;
  participants: string[];
  status: string;
  isImportant: boolean;
};

type CreateEventSeriesResponse = EventSeriesApiResponse<EventSeriesItem>;

export type {
  EventSeriesRepeatPattern,
  EventSeriesItem,
  EventSeriesApiResponse,
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
};
