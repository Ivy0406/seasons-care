import useCreateEventSeries from '@/features/calendar/hooks/useCreateEventSeries';
import useCreateCareLogEntry from '@/pages/CareLog/hooks/useCreateCareLogEntry';
import type { CareLogEntry } from '@/pages/CareLog/types';

function useCreateCalendarEntry() {
  const { isLoading: isCreatingCareLog, handleCreateCareLogEntry } =
    useCreateCareLogEntry();
  const { isLoading: isCreatingEventSeries, handleCreateEventSeries } =
    useCreateEventSeries();

  const handleCreateCalendarEntry = async (entry: CareLogEntry) => {
    if (entry.repeatPattern && entry.repeatPattern !== 'none') {
      return handleCreateEventSeries(entry);
    }

    return handleCreateCareLogEntry(entry);
  };

  return {
    isLoading: isCreatingCareLog || isCreatingEventSeries,
    handleCreateCalendarEntry,
  };
}

export default useCreateCalendarEntry;
