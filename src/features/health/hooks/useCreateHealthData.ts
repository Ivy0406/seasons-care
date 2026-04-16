import { useState } from 'react';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import type { HealthDraft } from '@/features/health/types';

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
  const defaultDate = format(today, 'yyyy/MM/dd');
  const defaultTime = format(today, 'HH:mm');

  const [recordDate, setRecordDate] = useState(defaultDate);
  const [recordTime, setRecordTime] = useState(defaultTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } =
    useForm<HealthDataFormValues>({
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

  const watchedValues = watch();
  const { systolic, diastolic } = watchedValues;
  const bloodPressureValid =
    (systolic === '' && diastolic === '') ||
    (systolic !== '' && diastolic !== '');
  const hasAnyValue =
    Object.values(watchedValues).some((v) => v !== '') && bloodPressureValid;

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

    if (promises.length === 0) return;

    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(promises);
      const hasFailure = results.some((r) => r.status === 'rejected');
      if (hasFailure) {
        onError?.();
      } else {
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyVoiceDraft = (draft: HealthDraft, transcript: string) => {
    if (
      /(今天|明天|後天|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[/月]\d{1,2})/u.test(
        transcript,
      )
    ) {
      setRecordDate(draft.dateValue.replaceAll('-', '/'));
    }

    if (
      /(?:早上|上午|中午|下午|晚上)\s*\d{1,2}(?:[:：點時]\d{1,2})?(?:分)?|\d{1,2}[:：]\d{2}/u.test(
        transcript,
      )
    ) {
      setRecordTime(draft.timeValue);
    }

    setValue('systolic', draft.systolic);
    setValue('diastolic', draft.diastolic);
    setValue('temperature', draft.temperature);
    setValue('spO2', draft.bloodOxygen);
    setValue('weight', draft.weight);
    setValue('glucoseLevel', draft.bloodSugar);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isSubmitting,
    hasAnyValue,
    recordDate,
    recordTime,
    setRecordDate,
    setRecordTime,
    applyVoiceDraft,
  };
}

export default useCreateHealthData;
export type { HealthDataFormValues };
