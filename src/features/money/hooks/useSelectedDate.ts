import { useQuery, useQueryClient } from '@tanstack/react-query';

const SELECTED_DATE_KEY = ['selectedDate'] as const;

function useSelectedDate() {
  const queryClient = useQueryClient();

  const { data: selectedDate } = useQuery({
    queryKey: SELECTED_DATE_KEY,
    queryFn: () => new Date(),
    initialData: new Date(),
    staleTime: Infinity,
  });

  const setSelectedDate = (date: Date) => {
    queryClient.setQueryData(SELECTED_DATE_KEY, date);
  };

  return { selectedDate, setSelectedDate };
}

export default useSelectedDate;
