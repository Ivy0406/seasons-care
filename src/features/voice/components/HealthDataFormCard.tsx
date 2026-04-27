import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import DataFormCard from '@/components/common/DataFormCard';
import {
  HealthDataForm,
  type HealthDataFormField,
} from '@/components/common/SmallDataForm';
import type { HealthDraft } from '@/features/health/types';

type HealthDataFormCardProps = {
  value: HealthDraft;
  onChange: (updates: Partial<HealthDraft>) => void;
  onValidityChange?: (valid: boolean) => void;
};

type VoiceHealthFormValues = Record<HealthDataFormField, string>;

function HealthDataFormCard({
  value,
  onChange,
  onValidityChange,
}: HealthDataFormCardProps) {
  const {
    register: rhfRegister,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<VoiceHealthFormValues>({
    mode: 'onChange',
    defaultValues: {
      systolic: value.systolic,
      diastolic: value.diastolic,
      temperature: value.temperature,
      spO2: value.bloodOxygen,
      weight: value.weight,
      glucoseLevel: value.bloodSugar,
    },
  });

  const customRegister = ((name: keyof VoiceHealthFormValues) => {
    if (name === 'systolic') {
      return rhfRegister('systolic', {
        validate: (fieldValue) => {
          if (!fieldValue) {
            return getValues('diastolic') ? '請同時填寫收縮壓' : true;
          }

          const numericValue = Number(fieldValue);

          if (numericValue < 50 || numericValue > 250) {
            return '收縮壓需介於 50 - 250 mmHg';
          }

          const diastolicValue = getValues('diastolic');

          if (diastolicValue) {
            const diastolicNumber = Number(diastolicValue);

            if (diastolicNumber > 0 && numericValue <= diastolicNumber) {
              return '收縮壓需大於舒張壓';
            }
          }

          return true;
        },
        onChange: () => {
          onChange({ systolic: getValues('systolic') });
          trigger('diastolic');
        },
      });
    }

    if (name === 'diastolic') {
      return rhfRegister('diastolic', {
        validate: (fieldValue) => {
          if (!fieldValue) {
            return getValues('systolic') ? '請同時填寫舒張壓' : true;
          }

          const numericValue = Number(fieldValue);

          if (numericValue < 30 || numericValue > 150) {
            return '舒張壓需介於 30 - 150 mmHg';
          }

          const systolicValue = getValues('systolic');

          if (systolicValue) {
            const systolicNumber = Number(systolicValue);

            if (systolicNumber > 0 && numericValue >= systolicNumber) {
              return '舒張壓需小於收縮壓';
            }
          }

          return true;
        },
        onChange: () => {
          onChange({ diastolic: getValues('diastolic') });
          trigger('systolic');
        },
      });
    }

    if (name === 'temperature') {
      return rhfRegister('temperature', {
        validate: (fieldValue) => {
          if (!fieldValue) return true;
          const numericValue = Number(fieldValue);
          return (
            (numericValue >= 33 && numericValue <= 43) ||
            '體溫需介於 33°C - 43°C'
          );
        },
        onChange: () => {
          onChange({ temperature: getValues('temperature') });
        },
      });
    }

    if (name === 'spO2') {
      return rhfRegister('spO2', {
        validate: (fieldValue) => {
          if (!fieldValue) return true;
          const numericValue = Number(fieldValue);
          return (
            (numericValue >= 50 && numericValue <= 100) ||
            '血氧需介於 50% - 100%'
          );
        },
        onChange: () => {
          onChange({ bloodOxygen: getValues('spO2') });
        },
      });
    }

    if (name === 'weight') {
      return rhfRegister('weight', {
        validate: (fieldValue) => {
          if (!fieldValue) return true;
          const numericValue = Number(fieldValue);
          return (
            (numericValue >= 30 && numericValue <= 300) ||
            '體重需介於 30 - 300 kg'
          );
        },
        onChange: () => {
          onChange({ weight: getValues('weight') });
        },
      });
    }

    return rhfRegister('glucoseLevel', {
      validate: (fieldValue) => {
        if (!fieldValue) return true;
        const numericValue = Number(fieldValue);
        return (
          (numericValue >= 40 && numericValue <= 200) ||
          '血糖需介於 40 - 200 mg/dL'
        );
      },
      onChange: () => {
        onChange({ bloodSugar: getValues('glucoseLevel') });
      },
    });
  }) as typeof rhfRegister;

  const watchedValues = watch();
  const hasAnyValue = Object.values(watchedValues).some(
    (fieldValue) => fieldValue.trim() !== '',
  );

  const isValid =
    hasAnyValue &&
    Object.keys(errors).length === 0 &&
    (!watchedValues.systolic || !watchedValues.diastolic
      ? watchedValues.systolic === watchedValues.diastolic
      : true);

  useEffect(() => {
    setValue('systolic', value.systolic, { shouldValidate: true });
    setValue('diastolic', value.diastolic, { shouldValidate: true });
    setValue('temperature', value.temperature, { shouldValidate: true });
    setValue('spO2', value.bloodOxygen, { shouldValidate: true });
    setValue('weight', value.weight, { shouldValidate: true });
    setValue('glucoseLevel', value.bloodSugar, { shouldValidate: true });
  }, [
    setValue,
    value.bloodOxygen,
    value.bloodSugar,
    value.diastolic,
    value.systolic,
    value.summary,
    value.temperature,
    value.transcript,
    value.weight,
  ]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <DataFormCard title="健康數值紀錄" className="bg-neutral-200">
      <DataFormCard.Content>
        <HealthDataForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          register={customRegister}
          errors={errors}
          recordDate={value.dateValue}
          recordTime={value.timeValue}
          onDateChange={(dateValue) => onChange({ dateValue })}
          onTimeChange={(timeValue) => onChange({ timeValue })}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default HealthDataFormCard;
