import apiClient from '@/api/client';
import type {
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
} from '@/types/eventSeries';

const buildEventSeriesPath = (careGroupId: string) =>
  `/api/care-groups/${careGroupId}/event-series`;

const createEventSeries = (
  careGroupId: string,
  payload: CreateEventSeriesPayload,
) =>
  apiClient.post<CreateEventSeriesResponse>(
    buildEventSeriesPath(careGroupId),
    payload,
    {
      headers: {
        careGroupId,
      },
    },
  );

export default createEventSeries;
