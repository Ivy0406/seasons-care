import { useQuery } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';

import { getMemberTotals } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import useSelectedMonth from '@/features/money/hooks/useSelectedMonth';
import moneyKeys from '@/features/money/queryKeys';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function useMemberTotals() {
  const careGroupId = getCurrentCareGroupId();
  const { selectedMonth } = useSelectedMonth();

  const targetDate = formatISO(new Date(`${selectedMonth}-01`));

  const query = useQuery({
    queryKey: moneyKeys.memberTotals(careGroupId ?? '', selectedMonth),
    queryFn: async () => {
      if (!careGroupId) return [];
      try {
        const response = await getMemberTotals(careGroupId, {
          scope: 'monthly',
          targetDate,
          pendingOnly: false,
        });
        return response.data.data.members;
      } catch {
        toast.error('載入成員花費失敗');
        return [];
      }
    },
    enabled: !!careGroupId,
  });

  return {
    ...query,
    members: query.data ?? [],
  };
}

export default useMemberTotals;
