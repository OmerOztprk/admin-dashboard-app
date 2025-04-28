export interface PaginationRequest {
    skip: number;
    limit: number;
  }
  
  export interface PaginationResponse<T> {
    data: T[];
    total: number;
  }
  