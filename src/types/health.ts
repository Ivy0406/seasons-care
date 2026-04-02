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

type BloodPressuresPayload = {
  systolic: number;
  diastolic: number;
  notes?: string;
  recordDate: string;
};

type BloodPressuresResponse = {
  success: boolean;
  message: string;
  data: {
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
  BloodPressuresPayload,
  BloodPressuresResponse,
  BloodSugarPayload,
  BloodSugarResponse,
  temperturesPayload,
  temperturesResponse,
  WeightPayload,
  WeightResponse,
};
