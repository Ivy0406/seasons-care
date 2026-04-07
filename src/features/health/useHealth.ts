import { useEffect, useState } from 'react';

import { getBloodOxygens, getBloodPressures, getTemperatures } from '@/api/endpoints/health';
import type { BloodOxygenData, BloodPressureData, TemperatureData } from '@/types/health';

type HealthData = {
  bloodPressure: BloodPressureData;
  bloodOxygen: BloodOxygenData;
  temperature: TemperatureData;
  isLoading: boolean;
};

function useHealth(): HealthData {
  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>({
    date: '--',
    time: '--',
    systolic: '--',
    diastolic: '--',
  });
  const [temperature, setTemperature] = useState<TemperatureData>({
    date: '--',
    time: '--',
    value: '--',
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
        const [bpRes, boRes, tempRes] = await Promise.all([
          getBloodPressures(),
          getBloodOxygens(),
          getTemperatures(),
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
        const tempRecords = tempRes.data.data;
        if (tempRecords.length > 0) {
          const latest = tempRecords.reduce((a, b) =>
            new Date(a.recordDate) > new Date(b.recordDate) ? a : b,
          );
          const dateObj = new Date(latest.recordDate);
          setTemperature({
            date: dateObj.toLocaleDateString('zh-TW'),
            time: dateObj.toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            value: latest.value,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getAllHealthData();
  }, []);

  return { bloodPressure, bloodOxygen, temperature, isLoading };
}

export default useHealth;
