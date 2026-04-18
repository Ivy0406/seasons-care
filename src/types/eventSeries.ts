import type { CareLogPagination } from '@/types/careLog';

type EventSeriesRepeatPattern = 'none' | 'daily' | 'weeklyDay' | 'monthly';

type EventSeriesItem = {
  eventSeriesId: string;
  title: string;
  description: string;
  scheduledAt?: string;
  startsAt?: string;
  repeatPattern: EventSeriesRepeatPattern;
  participants: string[];
  status: string;
  isImportant: boolean;
  daysOfWeek?: number[];
  careGroupId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
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
  repeatPattern: EventSeriesRepeatPattern;
  daysOfWeek: number[];
  participants: string[];
  isImportant: boolean;
};

type CreateEventSeriesResponse = EventSeriesApiResponse<EventSeriesItem>;

type UpdateEventSeriesPayload = CreateEventSeriesPayload;

type UpdateEventSeriesResponse = EventSeriesApiResponse<EventSeriesItem>;

type DeleteEventSeriesResponse = EventSeriesApiResponse<null>;

export type {
  EventSeriesRepeatPattern,
  EventSeriesItem,
  EventSeriesApiResponse,
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
  UpdateEventSeriesPayload,
  UpdateEventSeriesResponse,
  DeleteEventSeriesResponse,
};
