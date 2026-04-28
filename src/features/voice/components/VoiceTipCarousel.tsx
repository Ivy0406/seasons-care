import { useCallback, useEffect, useRef, useState } from 'react';

import cn from '@/lib/utils';

const VOICE_TIPS = [
  '試著說：「今天下午三點要去成大看醫生，重要」',
  '試著說：「明天早上十點陳醫師回診，媽媽和爸爸都要去」',
  '試著說：「每天早上九點提醒爸爸吃藥」',
  '試著說：「下週二帶爸爸去回診」',
  '一次說多件事，系統會自動拆分成多筆記錄',
  '說「明天」、「後天」可自動帶入日期',
  '說「重要」或「緊急」可標記為重要事項',
  '加上成員名字，可自動關聯參與者',
  '試著說：「午餐便當 80 元」',
  '試著說：「計程車費 200 元」',
  '試著說：「藥費 350 元，分帳」',
  '試著說：「早餐 50 元，午餐便當 90 元」',
  '試著說：「吃飯花了 150 元，一起出」',
  '說「分帳」或「平分」可開啟分帳功能',
  '試著說：「血壓 120/80，體重 65 公斤」',
  '試著說：「血糖 110，血氧 98」',
  '試著說：「體溫 36.5，體重 68 公斤」',
  '試著說：「早上血壓 130/85，下午體溫 37.2」',
  '試著說：「晚上血糖 95，體重 70 公斤」',
  '試著說：「收縮壓 130，舒張壓 80」',
] as const;

const TIP_INTERVAL_MS = 4000;

function VoiceTipCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback((nextIndex: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(nextIndex);
      setVisible(true);
    }, 200);
  }, []);

  const resetTimer = useCallback(
    (nextIndex: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const auto = (nextIndex + 1) % VOICE_TIPS.length;
        resetTimer(auto);
        goToNext(auto);
      }, TIP_INTERVAL_MS);
    },
    [goToNext],
  );

  useEffect(() => {
    resetTimer(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  const handleClick = () => {
    const next = (index + 1) % VOICE_TIPS.length;
    goToNext(next);
    resetTimer(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full flex-col items-center gap-1"
      aria-label="點擊換下一個提示"
    >
      <p
        className={cn(
          'font-paragraph-sm min-h-4 text-center text-neutral-700 transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {VOICE_TIPS[index]}
      </p>
    </button>
  );
}

export default VoiceTipCarousel;
