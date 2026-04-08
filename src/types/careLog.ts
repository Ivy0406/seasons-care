export type CareLogType = 'diary';

export type CareLogApiItem = {
  id: string;
  title: string;
  content: string;
  logType: string;
  recordDate: string;
  careGroupId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
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
  content: string;
  logType: CareLogType;
  recordDate: string;
};

export type CreateCareLogResponse = CareLogApiResponse<CareLogApiItem>;

export type GetCareLogEntriesParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type GetCareLogEntriesResponse = CareLogApiResponse<CareLogApiItem[]>;
