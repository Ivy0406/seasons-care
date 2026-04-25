import { useState } from 'react';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import type { HealthDraft } from '@/features/health/types';

import useCreateBloodOxygen from './useCreateBloodOxygen';
import useCreateBloodPressure from './useCreateBloodPressure';
import useCreateBloodSugar from './useCreateBloodSugar';
import useCreateTemperature from './useCreateTemperature';
import useCreateWeight from './useCreateWeight';

import type { UseFormRegister } from 'react-hook-form';

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

  const {
    register: rhfRegister,
    handleSubmit,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<HealthDataFormValues>({
    mode: 'onChange',
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

  const customRegister = ((name: keyof HealthDataFormValues) => {
    if (name === 'systolic') {
      return rhfRegister('systolic', {
        validate: (v) => {
          if (!v) return getValues('diastolic') ? '請同時填寫收縮壓' : true;
          const n: number = Number(v);
          if (n < 50 || n > 250) return '收縮壓需介於 50 - 250 mmHg';
          const diaStr = getValues('diastolic');
          if (diaStr) {
            const diaNum: number = Number(diaStr);
            if (diaNum > 0 && n <= diaNum) return '收縮壓需大於舒張壓';
          }
          return true;
        },
        onChange: () => trigger('diastolic'),
      });
    }
    if (name === 'diastolic') {
      return rhfRegister('diastolic', {
        validate: (v) => {
          if (!v) return getValues('systolic') ? '請同時填寫舒張壓' : true;
          const n = Number(v);
          if (n < 30 || n > 150) return '舒張壓需介於 30 - 150 mmHg';
          const sysStr = getValues('systolic');
          if (sysStr) {
            const sysNum = Number(sysStr);
            if (sysNum > 0 && n >= sysNum) return '舒張壓需小於收縮壓';
          }
          return true;
        },
        onChange: () => trigger('systolic'),
      });
    }
    if (name === 'temperature') {
      return rhfRegister('temperature', {
        validate: (v) => {
          if (!v) return true;
          const n = Number(v);
          if (n < 33 || n > 43) return '體溫需介於 33°C - 43°C';
          return true;
        },
      });
    }
    if (name === 'spO2') {
      return rhfRegister('spO2', {
        validate: (v) => {
          if (!v) return true;
          const n = Number(v);
          if (n < 50 || n > 100) return '血氧需介於 50% - 100%';
          return true;
        },
      });
    }
    if (name === 'weight') {
      return rhfRegister('weight', {
        validate: (v) => {
          if (!v) return true;
          const n = Number(v);
          if (n < 30 || n > 300) return '體重需介於 30 - 300 kg';
          return true;
        },
      });
    }
    if (name === 'glucoseLevel') {
      return rhfRegister('glucoseLevel', {
        validate: (v) => {
          if (!v) return true;
          const n = Number(v);
          if (n < 40 || n > 200) return '血糖需介於 40 - 200 mg/dL';
          return true;
        },
      });
    }
    return rhfRegister(name);
  }) as unknown as UseFormRegister<HealthDataFormValues>;

  const watchedValues = watch();
  const hasAnyValue =
    Object.values(watchedValues).some((v) => v !== '') &&
    Object.keys(errors).length === 0;

  function buildHealthSubmissions(
    values: HealthDataFormValues,
    isoDate: string,
  ): Promise<unknown>[] {
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

    return promises;
  }

  const onSubmit = async (values: HealthDataFormValues) => {
    const promises = buildHealthSubmissions(
      values,
      toISODate(recordDate, recordTime),
    );

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

  const submitFromDraft = async (draft: HealthDraft) => {
    const promises = buildHealthSubmissions(
      {
        spO2: draft.bloodOxygen,
        systolic: draft.systolic,
        diastolic: draft.diastolic,
        temperature: draft.temperature,
        weight: draft.weight,
        glucoseLevel: draft.bloodSugar,
      },
      toISODate(draft.dateValue, draft.timeValue),
    );

    if (promises.length === 0) return { success: true };

    const results = await Promise.allSettled(promises);

    return { success: results.every((r) => r.status === 'fulfilled') };
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
    register: customRegister,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isSubmitting,
    hasAnyValue,
    errors,
    recordDate,
    recordTime,
    setRecordDate,
    setRecordTime,
    applyVoiceDraft,
    submitFromDraft,
  };
}

export default useCreateHealthData;
export type { HealthDataFormValues };
