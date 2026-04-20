import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import cn from '@/lib/utils';

import useActivedMoneyTab from '../hooks/useActivedMoneyTab';

import DailyContent from './DailyContent';
import MonthlyContent from './MonthlyContent';

type MoneyTabs = 'daily' | 'monthly';
const moneyTabsList: MoneyTabs[] = ['daily', 'monthly'];

function MoneyTabsCard() {
  const { activeTab, setActivedMoneyTab } = useActivedMoneyTab();
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActivedMoneyTab(value as MoneyTabs)}
      className="w-full"
    >
      <div className="w-full overflow-hidden border-b-2 border-neutral-900">
        <TabsList className="h-10 w-full gap-0 rounded-none border-b-2 border-neutral-900 bg-transparent p-0">
          {moneyTabsList.map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'font-label-md h-full flex-1 rounded-none border-0 font-bold text-neutral-900 shadow-none transition-none',
                'data-active:bg-secondary-default data-active data-active:relative data-active:z-10 data-active:-mb-[4.32px] data-active:rounded-t-lg data-active:border-2 data-active:border-b-0 data-active:border-neutral-900',
                'data-[state=inactive]:bg-none',
              )}
            >
              {value === 'daily' ? '單日瀏覽' : '月份總覽'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="daily" className="bg-secondary-default px-6 py-5">
          <DailyContent />
        </TabsContent>

        <TabsContent value="monthly" className="bg-secondary-default px-6 py-5">
          <MonthlyContent />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default MoneyTabsCard;
