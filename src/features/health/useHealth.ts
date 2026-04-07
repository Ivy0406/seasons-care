import { useEffect, useState } from 'react';

import {
  getBloodOxygens,
  getBloodPressures,
  getBloodSugars,
  getTemperatures,
  getWeights,
} from '@/api/endpoints/health';
import type {
  BloodOxygenData,
  BloodPressureData,
  BloodSugarData,
  TemperatureData,
  WeightData,
} from '@/types/health';

type HealthData = {
  bloodPressure: BloodPressureData;
  bloodOxygen: BloodOxygenData;
  temperature: TemperatureData;
  weight: WeightData;
  bloodSugar: BloodSugarData;
  isLoading: boolean;
};

function getTimeSlot(recordDate: string): 'morning' | 'noon' | 'night' {
  const hour = new Date(recordDate).getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'noon';
  return 'night';
}

function useHealth(): HealthData {
  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>({
    date: '--',
    time: '--',
    systolic: '--',
    diastolic: '--',
  });
  const [bloodSugar, setBloodSugar] = useState<BloodSugarData>({
    morning: '--',
    noon: '--',
    night: '--',
  });
  const [weight, setWeight] = useState<WeightData>({
    date: '--',
    time: '--',
    value: '--',
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
        const [
          bloodPressureRes,
          bloodOxygenRes,
          temperatureRes,
          weightRes,
          bloodSugarRes,
        ] = await Promise.all([
          getBloodPressures(),
          getBloodOxygens(),
          getTemperatures(),
          getWeights(),
          getBloodSugars(),
        ]);

        const today = new Date().toDateString();

        const todayBpRecords = bloodPressureRes.data.data.filter(
          (r) => new Date(r.recordDate).toDateString() === today,
        );
        if (todayBpRecords.length > 0) {
          const latest = todayBpRecords.reduce((a, b) =>
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

        const todayBoRecords = bloodOxygenRes.data.data.filter(
          (r) => new Date(r.recordDate).toDateString() === today,
        );
        if (todayBoRecords.length > 0) {
          const latest = todayBoRecords.reduce((a, b) =>
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

        const todayTempRecords = temperatureRes.data.data.filter(
          (r) => new Date(r.recordDate).toDateString() === today,
        );
        if (todayTempRecords.length > 0) {
          const latest = todayTempRecords.reduce((a, b) =>
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

        const todayWeightRecords = weightRes.data.data.filter(
          (r) => new Date(r.recordDate).toDateString() === today,
        );
        if (todayWeightRecords.length > 0) {
          const latest = todayWeightRecords.reduce((a, b) =>
            new Date(a.recordDate) > new Date(b.recordDate) ? a : b,
          );
          const dateObj = new Date(latest.recordDate);
          setWeight({
            date: dateObj.toLocaleDateString('zh-TW'),
            time: dateObj.toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            value: latest.value,
          });
        }

        const todayBloodSugarRecords = bloodSugarRes.data.data.filter(
          (r) => new Date(r.recordDate).toDateString() === today,
        );
        const latestPerSlot: Record<
          string,
          { glucoseLevel: number; recordDate: string }
        > = {};
        todayBloodSugarRecords.forEach((r) => {
          const slot = getTimeSlot(r.recordDate);
          if (
            !latestPerSlot[slot] ||
            new Date(r.recordDate) > new Date(latestPerSlot[slot].recordDate)
          ) {
            latestPerSlot[slot] = {
              glucoseLevel: r.glucoseLevel,
              recordDate: r.recordDate,
            };
          }
        });
        setBloodSugar({
          morning: latestPerSlot.morning?.glucoseLevel ?? '--',
          noon: latestPerSlot.noon?.glucoseLevel ?? '--',
          night: latestPerSlot.night?.glucoseLevel ?? '--',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getAllHealthData();
  }, []);

  return {
    bloodPressure,
    bloodOxygen,
    temperature,
    weight,
    bloodSugar,
    isLoading,
  };
}

export default useHealth;
