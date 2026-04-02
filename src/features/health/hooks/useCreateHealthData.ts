import { useState } from 'react';

import { useForm } from 'react-hook-form';

import useCreateBloodOxygen from './useCreateBloodOxygen';
import useCreateBloodPressure from './useCreateBloodPressure';
import useCreateBloodSugar from './useCreateBloodSugar';
import useCreateTemperature from './useCreateTemperature';
import useCreateWeight from './useCreateWeight';

type HealthDataFormValues = {
  systolic: string;
  diastolic: string;
  temperature: string;
  spO2: string;
  weight: string;
  glucoseLevel: string;
};

type UseCreateHealthDataOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

function toISODate(date: string, time: string) {
  const localDateStr = `${date.replace(/\//g, '-')}T${time}:00`;
  return new Date(localDateStr).toISOString();
}

function useCreateHealthData({
  onSuccess,
  onError,
}: UseCreateHealthDataOptions = {}) {
  const today = new Date();
  const defaultDate = today.toISOString().slice(0, 10).replace(/-/g, '/');
  const defaultTime = today.toTimeString().slice(0, 5);

  const [recordDate, setRecordDate] = useState(defaultDate);
  const [recordTime, setRecordTime] = useState(defaultTime);

  const { register, handleSubmit } = useForm<HealthDataFormValues>({
    defaultValues: {
      systolic: '',
      diastolic: '',
      temperature: '',
      spO2: '',
      weight: '',
      glucoseLevel: '',
    },
  });

  const bloodOxygen = useCreateBloodOxygen();
  const bloodPressure = useCreateBloodPressure();
  const bloodSugar = useCreateBloodSugar();
  const temperature = useCreateTemperature();
  const weight = useCreateWeight();

  const isLoading =
    bloodOxygen.isLoading ||
    bloodPressure.isLoading ||
    bloodSugar.isLoading ||
    temperature.isLoading ||
    weight.isLoading;

  const onSubmit = async (values: HealthDataFormValues) => {
    const isoDate = toISODate(recordDate, recordTime);
    const promises: Promise<unknown>[] = [];

    if (values.spO2) {
      promises.push(
        bloodOxygen.submit({ spO2: Number(values.spO2), recordDate: isoDate }),
      );
    }
    if (values.systolic && values.diastolic) {
      promises.push(
        bloodPressure.submit({
          systolic: Number(values.systolic),
          diastolic: Number(values.diastolic),
          recordDate: isoDate,
        }),
      );
    }
    if (values.temperature) {
      promises.push(
        temperature.submit({
          value: Number(values.temperature),
          recordDate: isoDate,
        }),
      );
    }
    if (values.weight) {
      promises.push(
        weight.submit({ value: Number(values.weight), recordDate: isoDate }),
      );
    }
    if (values.glucoseLevel) {
      promises.push(
        bloodSugar.submit({
          glucoseLevel: Number(values.glucoseLevel),
          measurementContext: 'before_meal',
          recordDate: isoDate,
        }),
      );
    }

    try {
      await Promise.all(promises);
      onSuccess?.();
    } catch {
      onError?.();
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isLoading,
    recordDate,
    recordTime,
    setRecordDate,
    setRecordTime,
  };
}

export default useCreateHealthData;
export type { HealthDataFormValues };
