import { useEffect, useState } from 'react';

import { getBloodOxygens, getBloodPressures } from '@/api/endpoints/health';
import type { BloodOxygenData, BloodPressureData } from '@/types/health';

type HealthData = {
  bloodPressure: BloodPressureData;
  bloodOxygen: BloodOxygenData;
  isLoading: boolean;
};

function useHealth(): HealthData {
  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>({
    date: '--',
    time: '--',
    systolic: '--',
    diastolic: '--',
  });
  const [bloodOxygen, setBloodOxygen] = useState<BloodOxygenData>({
    date: '--',
    time: '--',
    spO2: '--',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllHealthData = async () => {
      setIsLoading(true);
      try {
        const [bpRes, boRes] = await Promise.all([
          getBloodPressures(),
          getBloodOxygens(),
        ]);

        const bpRecords = bpRes.data.data;
        if (bpRecords.length > 0) {
          const latest = bpRecords.reduce((a, b) =>
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

        const boRecords = boRes.data.data;
        if (boRecords.length > 0) {
          const latest = boRecords.reduce((a, b) =>
            new Date(a.recordDate) > new Date(b.recordDate) ? a : b,
          );
          const dateObj = new Date(latest.recordDate);
          setBloodOxygen({
            date: dateObj.toLocaleDateString('zh-TW'),
            time: dateObj.toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            spO2: latest.spO2,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getAllHealthData();
  }, []);

  return { bloodPressure, bloodOxygen, isLoading };
}

export default useHealth;
