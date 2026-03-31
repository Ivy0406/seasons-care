import { useState } from 'react';

import { ChevronDown, Mic } from 'lucide-react';

import avatars from '@/assets/images/avatars';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import { NavigationTopActions } from '@/components/common/NavigationBar';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

import HealthSummary from '../../../features/health/HealthSummary';
import mockCurrentUser from '../data/mockCurrentUser';

import DiarySummary from './DiarySummary';
import MoneySummary from './MoneySummary';
import WeekStrip from './WeekStrip';

function HomepageLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMoney, setShowMoney] = useState(false);
  const avatarSrcByKey = {
    'Avatar-01': avatars.avatar01,
    'Avatar-02': avatars.avatar02,
    'Avatar-03': avatars.avatar03,
    'Avatar-04': avatars.avatar04,
    'Avatar-05': avatars.avatar05,
    'Avatar-06': avatars.avatar06,
  } as const;
  const currentUserAvatarSrc =
    avatarSrcByKey[mockCurrentUser.avatarKey] ?? avatars.avatar01;

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

      <section className="bg-primary-default mt-5 flex gap-5 overflow-hidden rounded-sm rounded-xl border-2 border-neutral-900 px-3 py-5">
        <div className="">
          <SingleAvatar
            src={currentUserAvatarSrc}
            name={mockCurrentUser.userName}
            className="size-18.25 ring-2 ring-neutral-900"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <p className="font-label-md self-start bg-neutral-800 px-2 py-1 text-neutral-50">
              今日分析摘要
            </p>
            <p className="font-paragraph-md min-h-30 w-full border-2 border-neutral-900 bg-neutral-50 p-3 text-neutral-900">
              下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成
              80%，再加油一點點！
            </p>
          </div>
        </div>
      </section>
      <section className="mt-8 flex items-center justify-between gap-3 rounded-full border-2 border-neutral-900 bg-neutral-50 p-3 px-3 pb-3">
        <p className="font-label-md pl-6 text-neutral-900">
          {mockCurrentUser.userName}，你好 <br />
          今天想要記錄什麼照護資訊呢？
        </p>
        <RecordingDrawer
          trigger={
            <CircleButtonPrimary
              size="lg"
              className="border-0 bg-neutral-800"
              aria-label="開始語音輸入"
            >
              <Mic strokeWidth={1} className="stroke-[1.5]!" />
            </CircleButtonPrimary>
          }
        />
      </section>
      <section className="bg-secondary-default -mx-6 mt-11 rounded-t-xl border-2 border-neutral-900 px-6 py-5">
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
