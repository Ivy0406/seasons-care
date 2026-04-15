import { useState } from 'react';

import { useNavigate } from 'react-router';

import ViewMoreButton from '@/components/common/ViewMoreButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthDataCarousel from '@/features/health/HealthDataCarousel';
import cn from '@/lib/utils';

import DiarySummary from './DiarySummary';
import MoneySummary from './MoneySummary';

type Tab = 'diary' | 'money' | 'health';
type DailyOverviewTabsProps = {
  selectedDate: Date;
};

const TABS_LIST: {
  value: Tab;
  label: string;
  bgClass: string;
  textClass?: string;
}[] = [
  {
    value: 'diary',
    label: '今日日誌',
    bgClass: 'bg-primary-default data-active:bg-primary-default',
    textClass: 'font-heading-sm text-neutral-900',
  },
  {
    value: 'money',
    label: '今日帳目',
    bgClass: 'bg-secondary-default data-active:bg-secondary-default',
  },
  {
    value: 'health',
    label: '今日數據',
    bgClass: 'bg-neutral-800 data-active:bg-neutral-800',
    textClass:
      'text-neutral-50 hover:text-neutral-50 data-active:text-neutral-50',
  },
];

const triggerBaseClass =
  'font-heading-sm h-10 flex-1 rounded-t-lg border-2 border-b-0 border-neutral-900 text-neutral-900 shadow-none transition-none rounded-b-none';

function DailyOverviewTabs({ selectedDate }: DailyOverviewTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('diary');
  const navigate = useNavigate();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as Tab)}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col">
        <TabsList className="flex h-10 w-full gap-0 rounded-none bg-transparent p-0">
          {TABS_LIST.map(({ value, label, bgClass, textClass }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(triggerBaseClass, bgClass, textClass)}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value="diary"
          className="bg-primary-default flex flex-col gap-5 border-x-2 border-neutral-900 px-6 pt-7 pb-17"
        >
          <DiarySummary selectedDate={selectedDate} />
          <div className="flex justify-center">
            <ViewMoreButton onClick={() => navigate('/calendar-page')} />
          </div>
        </TabsContent>

        <TabsContent
          value="money"
          className="bg-secondary-default flex flex-col items-stretch gap-5 border-x-2 border-neutral-900 px-6 pt-7 pb-17"
        >
          <MoneySummary />
          <div className="flex justify-center">
            <ViewMoreButton onClick={() => navigate('/money')} />
          </div>
        </TabsContent>

        <TabsContent value="health" className="bg-neutral-800 pt-7 pb-17">
          <HealthDataCarousel />

          <div className="mt-5 flex justify-center">
            <ViewMoreButton onClick={() => navigate('/health-report')} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default DailyOverviewTabs;
