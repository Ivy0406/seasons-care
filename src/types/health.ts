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

export type { BloodOxygensPayload, BloodOxygensResponse };
