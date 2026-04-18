import apiClient from '@/api/client';
import type {
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
  UpdateEventSeriesPayload,
  UpdateEventSeriesResponse,
} from '@/types/eventSeries';

const buildEventSeriesPath = (careGroupId: string) =>
  `/api/care-groups/${careGroupId}/events`;

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

const updateEventSeries = (
  careGroupId: string,
  seriesId: string,
  payload: UpdateEventSeriesPayload,
) =>
  apiClient.put<UpdateEventSeriesResponse>(
    `${buildEventSeriesPath(careGroupId)}/${seriesId}`,
    payload,
    {
      headers: {
        careGroupId,
      },
    },
  );

export { updateEventSeries };

export default createEventSeries;
