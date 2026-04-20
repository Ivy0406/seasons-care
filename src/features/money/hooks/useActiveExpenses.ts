import { format } from 'date-fns';

import useExpenses from '@/features/money/hooks/useExpenses';
import useSelectedDate from '@/features/money/hooks/useSelectedDate';
import useSelectedMonth from '@/features/money/hooks/useSelectedMonth';

import useActivedMoneyTab from './useActivedMoneyTab';

function useActiveExpenses() {
  const { selectedMonth } = useSelectedMonth();
  const { selectedDate } = useSelectedDate();
  const { activeTab } = useActivedMoneyTab();

  const { expenses: monthlyExpenses, isLoading: isMonthlyLoading } =
    useExpenses(selectedMonth);

  const dailyMonth = format(selectedDate, 'yyyy-MM');
  const { expenses: dailyMonthExpenses, isLoading: isDailyLoading } =
    useExpenses(dailyMonth);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dailyExpenses = dailyMonthExpenses.filter((e) =>
    e.expenseDate.startsWith(selectedDateStr),
  );

  const cardListItems = activeTab === 'daily' ? dailyExpenses : monthlyExpenses;
  const isLoading = activeTab === 'daily' ? isDailyLoading : isMonthlyLoading;

  return { monthlyExpenses, dailyExpenses, cardListItems, isLoading };
}

export default useActiveExpenses;
