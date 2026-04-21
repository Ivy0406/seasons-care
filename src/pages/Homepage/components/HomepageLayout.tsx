import { useState } from 'react';

import { ChevronDown, Mic } from 'lucide-react';

import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import { NavigationTopActions } from '@/components/common/NavigationBar';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

import HealthSummary from '../../../features/health/HealthSummary';

import DiarySummary from './DiarySummary';
import MoneySummary from './MoneySummary';
import WeekStrip from './WeekStrip';

function HomepageLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMoney, setShowMoney] = useState(false);

  return (
    <main className="flex min-h-screen w-full flex-col pt-4 pb-10 text-neutral-900">
      <NavigationTopActions hasNotification className="px-0" />

      <section className="flex flex-col">
        <div className="flex items-center gap-2 py-2">
          <h1 className="font-heading-lg">王爸爸的照護群組</h1>
          <ChevronDown className="size-6 shrink-0" strokeWidth={2} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="font-label-md flex items-end gap-1">
            <span className="">照護第</span>
            <span className="font-label-md relative inline-block px-1 leading-none">
              <span className="bg-primary-default absolute inset-x-0 bottom-0 h-[45%]" />
              <span className="font-heading-lg relative">125</span>
            </span>
            <span className="">天</span>
          </div>

          <UserGroup>
            <SingleAvatar
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png"
              name="Amy"
              className="size-8 bg-neutral-300"
            />
            <SingleAvatar
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png"
              name="Ben"
              className="size-8 bg-neutral-300"
            />
            <SingleAvatar
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png"
              name="Chloe"
              className="size-8 bg-neutral-300"
            />
            <SingleAvatar
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png"
              name="David"
              className="size-8 bg-neutral-300"
            />
          </UserGroup>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-sm border-2 border-neutral-900 bg-neutral-50">
        <div className="bg-primary-default px-3 py-3">
          <p className="font-label-md">王希銘，你好</p>
          <p className="font-paragraph-md">今天想要記錄什麼資訊呢？</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 px-3 pb-3">
          <p className="font-paragraph-md text-neutral-700">今日要去回診...</p>
          <RecordingDrawer
            trigger={
              <CircleButtonPrimary size="md" aria-label="開始語音輸入">
                <Mic />
              </CircleButtonPrimary>
            }
          />
        </div>
      </section>
      <section className="bg-secondary-default -mx-6 mt-5 rounded-t-xl border-2 border-neutral-900 px-6 py-5">
        <WeekStrip selected={selectedDate} onSelect={setSelectedDate} />
        {showMoney ? (
          <MoneySummary onSwitchToDiary={() => setShowMoney(false)} />
        ) : (
          <DiarySummary onSwitchToMoney={() => setShowMoney(true)} />
        )}
        <HealthSummary />
      </section>
    </main>
  );
}

export default HomepageLayout;
