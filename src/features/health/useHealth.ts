import type {
  BloodOxygenData,
  BloodPressureData,
  BloodSugarData,
  TemperatureData,
  WeightData,
} from '@/types/health';

import useGetBloodOxygen from './hooks/useGetBloodOxygen';
import useGetBloodPressure from './hooks/useGetBloodPressure';
import useGetBloodSugar from './hooks/useGetBloodSugar';
import useGetTemperature from './hooks/useGetTemperature';
import useGetWeight from './hooks/useGetWeight';

const defaultBloodPressure: BloodPressureData = {
  date: '--',
  time: '--',
  systolic: '--',
  diastolic: '--',
};
const defaultBloodOxygen: BloodOxygenData = {
  date: '--',
  time: '--',
  spO2: '--',
};
const defaultTemperature: TemperatureData = {
  date: '--',
  time: '--',
  value: '--',
};
const defaultWeight: WeightData = { date: '--', time: '--', value: '--' };
const defaultBloodSugar: BloodSugarData = {
  morning: '--',
  noon: '--',
  night: '--',
};

function useHealth() {
  const bloodPressure = useGetBloodPressure();
  const bloodOxygen = useGetBloodOxygen();
  const temperature = useGetTemperature();
  const weight = useGetWeight();
  const bloodSugar = useGetBloodSugar();

  return {
    bloodPressure: bloodPressure.data ?? defaultBloodPressure,
    bloodOxygen: bloodOxygen.data ?? defaultBloodOxygen,
    temperature: temperature.data ?? defaultTemperature,
    weight: weight.data ?? defaultWeight,
    bloodSugar: bloodSugar.data ?? defaultBloodSugar,
    isLoading:
      bloodPressure.isLoading ||
      bloodOxygen.isLoading ||
      temperature.isLoading ||
      weight.isLoading ||
      bloodSugar.isLoading,
  };
}

export default useHealth;
