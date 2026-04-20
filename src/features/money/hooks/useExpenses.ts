import { useQuery } from '@tanstack/react-query';
import { endOfMonth, format, parseISO } from 'date-fns';
import { toast } from 'sonner';

import { getMoneyItems } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import moneyKeys from '@/features/money/queryKeys';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function useExpenses(month: string) {
  const careGroupId = getCurrentCareGroupId();
  const hasCareGroupId = careGroupId !== null;
  const startDate = `${month}-01T00:00:00`;
  const endDate = format(
    endOfMonth(parseISO(`${month}-01`)),
    "yyyy-MM-dd'T'23:59:59",
  );
  const query = useQuery({
    queryKey: moneyKeys.list(careGroupId ?? '', month),
    queryFn: async () => {
      if (!careGroupId) return [];
      try {
        const response = await getMoneyItems(careGroupId, {
          StartDate: startDate,
          EndDate: endDate,
        });
        return response.data.data;
      } catch {
        toast.error('載入帳目失敗');
        return [];
      }
    },
    enabled: hasCareGroupId,
  });

  return {
    ...query,
    expenses: query.data ?? [],
  };
}

export default useExpenses;
