import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const date = subMonths(new Date(), i);
  return { label: format(date, 'yyyy.MM'), value: format(date, 'yyyy-MM') };
});

function useSelectedMonth() {
  const queryClient = useQueryClient();

  const { data: selectedMonth } = useQuery({
    queryKey: ['selectedMonth'],
    queryFn: () => MONTH_OPTIONS[0].value,
    initialData: MONTH_OPTIONS[0].value,
    staleTime: Infinity,
  });

  const setSelectedMonth = (month: string) => {
    queryClient.setQueryData(['selectedMonth'], month);
  };

  return { selectedMonth, setSelectedMonth } as const;
}

export { MONTH_OPTIONS };
export default useSelectedMonth;
