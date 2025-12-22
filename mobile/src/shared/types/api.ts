export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
  };
  
  export type ApiError = {
    message?: string | string[];
    error?: string;
    statusCode?: number;
  };