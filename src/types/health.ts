type BloodOxygensPayload = {
  spO2: number;
  notes?: string;
  recordDate: string;
};

type BloodOxygensResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    careGroupId: string;
    spO2: number;
    notes?: string;
    recordDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

type BloodOxygenRecord = {
  id: string;
  careGroupId: string;
  spO2: number;
  notes?: string;
  recordDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type GetBloodOxygensResponse = {
  data: BloodOxygenRecord[];
};

type BloodOxygenData = {
  date: string;
  time: string;
  spO2: number | '--';
};

type BloodPressuresPayload = {
  systolic: number;
  diastolic: number;
  notes?: string;
  recordDate: string;
};

type BloodPressureRecord = {
  id: string;
  careGroupId: string;
  systolic: number;
  diastolic: number;
  notes?: string;
  recordDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type BloodPressuresResponse = {
  success: boolean;
  message: string;
  data: BloodPressureRecord;
};

type GetBloodPressuresResponse = {
  data: BloodPressureRecord[];
};

type BloodPressureData = {
  date: string;
  time: string;
  systolic: number | '--';
  diastolic: number | '--';
};

type BloodSugarPayload = {
  glucoseLevel: number;
  measurementContext: string;
  notes?: string;
  recordDate: string;
};

type BloodSugarResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    careGroupId: string;
    glucoseLevel: number;
    measurementContext: string;
    notes?: string;
    recordDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

type temperturesPayload = {
  value: number;
  notes?: string;
  recordDate: string;
};

type temperturesResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    careGroupId: string;
    value: number;
    notes?: string;
    recordDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

type TemperatureRecord = {
  id: string;
  careGroupId: string;
  value: number;
  notes?: string;
  recordDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type GetTemperaturesResponse = {
  data: TemperatureRecord[];
};

type TemperatureData = {
  date: string;
  time: string;
  value: number | '--';
};

type WeightPayload = {
  value: number;
  notes?: string;
  recordDate: string;
};

type WeightResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    careGroupId: string;
    value: number;
    notes?: string;
    recordDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  };
};

export type {
  BloodOxygensPayload,
  BloodOxygensResponse,
  BloodOxygenRecord,
  GetBloodOxygensResponse,
  BloodOxygenData,
  BloodPressuresPayload,
  BloodPressureRecord,
  BloodPressuresResponse,
  GetBloodPressuresResponse,
  BloodPressureData,
  BloodSugarPayload,
  BloodSugarResponse,
  temperturesPayload,
  temperturesResponse,
  TemperatureRecord,
  GetTemperaturesResponse,
  TemperatureData,
  WeightPayload,
  WeightResponse,
};
