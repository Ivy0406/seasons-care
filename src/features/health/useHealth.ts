import { useEffect, useState } from 'react';

import { getBloodPressures } from '@/api/endpoints/health';
import type { BloodPressureData } from '@/types/health';

type HealthData = {
  bloodPressure: BloodPressureData;
  isLoading: boolean;
};

function useHealth(): HealthData {
  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>({
    date: '--',
    time: '--',
    systolic: '--',
    diastolic: '--',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllHealthData = async () => {
      setIsLoading(true);
      try {
        const res = await getBloodPressures();
        const records = res.data.data;

        if (records.length > 0) {
          const latest = records.reduce((a, b) =>
            new Date(a.recordDate) > new Date(b.recordDate) ? a : b,
          );
          const dateObj = new Date(latest.recordDate);
          setBloodPressure({
            date: dateObj.toLocaleDateString('zh-TW'),
            time: dateObj.toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            systolic: latest.systolic,
            diastolic: latest.diastolic,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getAllHealthData();
  }, []);

  return { bloodPressure, isLoading };
}

export default useHealth;
