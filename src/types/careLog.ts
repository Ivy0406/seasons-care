export type CareLogType = 'diary';
export type CareLogStatus = 'pending' | 'completed';
export type CareLogRepeatPattern = 'none' | 'daily' | 'weeklyDay' | 'monthly';

export type CareLogApiItem = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  startsAt?: string;
  recordDate?: string;
  repeatPattern?: CareLogRepeatPattern;
  participants?: string[];
  status?: CareLogStatus;
  isImportant?: boolean;
  logType?: string;
  careGroupId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};

export type CareLogPagination = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type CareLogApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  traceId: string;
  pagination: CareLogPagination;
};

export type CareLogProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  [key: string]: unknown;
};

export type CreateCareLogPayload = {
  title: string;
  description: string;
  startsAt: string;
  participants: string[];
  status?: CareLogStatus;
  isImportant?: boolean;
  repeatPattern?: CareLogRepeatPattern;
};

export type CreateCareLogResponse = CareLogApiResponse<CareLogApiItem>;

export type GetCareLogEntriesParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type GetCareLogEntriesResponse = CareLogApiResponse<CareLogApiItem[]>;
