import { useEffect, useState } from 'react';

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

function createDateLabel(date: Date) {
  return {
    day: `${date.getMonth() + 1}/${date.getDate()}`,
    weekday: `(${WEEKDAY_LABELS[date.getDay()]})`,
  };
}

export default function useCurrentDateLabel() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      timeoutId = setTimeout(() => {
        setCurrentDate(new Date());
        scheduleNextRefresh();
      }, nextMidnight.getTime() - now.getTime());
    };

    scheduleNextRefresh();

    return () => clearTimeout(timeoutId);
  }, []);

  return createDateLabel(currentDate);
}
