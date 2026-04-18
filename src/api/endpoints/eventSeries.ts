import apiClient from '@/api/client';
import type {
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
  DeleteEventSeriesResponse,
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
  apiClient.post<UpdateEventSeriesResponse>(
    `${buildEventSeriesPath(careGroupId)}/${seriesId}`,
    payload,
    {
      headers: {
        careGroupId,
      },
    },
  );

const deleteEventSeries = (careGroupId: string, seriesId: string) =>
  apiClient.delete<DeleteEventSeriesResponse>(
    `${buildEventSeriesPath(careGroupId)}/${seriesId}`,
    {
      headers: {
        careGroupId,
      },
    },
  );

export { updateEventSeries, deleteEventSeries };

export default createEventSeries;
