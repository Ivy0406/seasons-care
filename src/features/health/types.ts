export type HealthMetricValue = number | '--';

export type HealthDraft = {
  dateValue: string;
  timeValue: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  bloodOxygen: string;
  weight: string;
  bloodSugar: string;
  transcript: string;
  summary: string;
};

export type HealthRecord = {
  id: string;
  recordedAt: string;
  summary: string;
  transcript: string;
  bloodPressure: {
    systolic: number | null;
    diastolic: number | null;
  };
  temperature: number | null;
  bloodOxygen: number | null;
  weight: number | null;
  bloodSugar: number | null;
};

export type HealthData = {
  time: string | '';
  summary: { content: string };
  bloodPressure: { systolic: HealthMetricValue; diastolic: HealthMetricValue };
  temperature: HealthMetricValue;
  bloodOxygen: HealthMetricValue;
  weight: HealthMetricValue;
  bloodSugar: {
    morning: HealthMetricValue;
    noon: HealthMetricValue;
    night: HealthMetricValue;
  };
};
