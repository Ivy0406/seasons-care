import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { MoneyTab } from '../types';

function useActivedMoneyTab() {
  const queryClient = useQueryClient();

  const { data: activeTab } = useQuery({
    queryKey: ['activeMoneyTab'],
    queryFn: () => 'daily',
    initialData: 'daily' as MoneyTab,
    staleTime: Infinity,
  });

  const setActivedMoneyTab = (tab: MoneyTab) => {
    queryClient.setQueryData(['activeMoneyTab'], tab);
  };

  return { activeTab, setActivedMoneyTab } as const;
}

export default useActivedMoneyTab;
