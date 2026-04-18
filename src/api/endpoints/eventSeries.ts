import apiClient from '@/api/client';
import type {
  CreateEventSeriesPayload,
  CreateEventSeriesResponse,
  DeleteEventSeriesResponse,
  UpdateEventOccurrencePayload,
  UpdateEventOccurrenceResponse,
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

const updateEventOccurrenceStatus = (
  careGroupId: string,
  seriesId: string,
  payload: UpdateEventOccurrencePayload,
) =>
  apiClient.post<UpdateEventOccurrenceResponse>(
    `${buildEventSeriesPath(careGroupId)}/${seriesId}/status`,
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

export { updateEventSeries, updateEventOccurrenceStatus, deleteEventSeries };

export default createEventSeries;
