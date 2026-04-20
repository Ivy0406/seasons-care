import { useState } from 'react';

import { useNavigate } from 'react-router';

import BackToTopButton from '@/components/common/BackToTopButton';
import ViewMoreButton from '@/components/common/ViewMoreButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthDataCarousel from '@/features/health/HealthDataCarousel';
import cn from '@/lib/utils';

import DiarySummary from './DiarySummary';
import MoneySummary from './MoneySummary';

type Tab = 'diary' | 'money' | 'health';
type DailyOverviewTabsProps = {
  selectedDate: Date;
  onCreateDiaryEntry: () => void;
  onCreateMoneyEntry: () => void;
  onBackToTop?: () => void;
};

const TABS_LIST: {
  value: Tab;
  label: string;
  bgClass: string;
  textClass?: string;
}[] = [
  {
    value: 'diary',
    label: '今日任務',
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

function DailyOverviewTabs({
  selectedDate,
  onCreateDiaryEntry,
  onCreateMoneyEntry,
  onBackToTop,
}: DailyOverviewTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('diary');
  const navigate = useNavigate();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as Tab)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* TabsList 固定，不隨內容滾動 */}
        <div className="bg-neutral-200 pt-2">
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
        </div>

        {/* 各 TabsContent 各自滾動 */}
        <TabsContent
          value="diary"
          className="bg-primary-default flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto border-x-2 border-neutral-900 px-6 pt-7 pb-17"
        >
          <DiarySummary
            selectedDate={selectedDate}
            onCreateEntry={onCreateDiaryEntry}
          />
          <div className="flex flex-col items-center gap-4">
            <ViewMoreButton onClick={() => navigate('/calendar-page')} />
            {onBackToTop && (
              <BackToTopButton variant="light" onClick={onBackToTop} />
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="money"
          className="bg-secondary-default flex min-h-0 flex-1 flex-col items-stretch gap-5 overflow-y-auto border-x-2 border-neutral-900 px-6 pt-7 pb-17"
        >
          <MoneySummary
            selectedDate={selectedDate}
            onCreateEntry={onCreateMoneyEntry}
          />
          <div className="flex flex-col items-center gap-4">
            <ViewMoreButton onClick={() => navigate('/money')} />
            {onBackToTop && (
              <BackToTopButton variant="light" onClick={onBackToTop} />
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="health"
          className="flex min-h-0 w-screen max-w-200 flex-1 flex-col overflow-x-hidden overflow-y-auto border-x-2 border-neutral-900 bg-neutral-800 pt-7 pb-17"
        >
          <HealthDataCarousel />

          <div className="mt-5 flex flex-col items-center gap-4">
            <ViewMoreButton onClick={() => navigate('/health-report')} />
            {onBackToTop && (
              <BackToTopButton variant="light" onClick={onBackToTop} />
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default DailyOverviewTabs;
