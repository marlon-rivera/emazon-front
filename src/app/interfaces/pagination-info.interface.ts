export interface PaginationInfo<T> {
  list: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface PaginationInfoResponse<T>{
  paginationInfo: PaginationInfo<T>;
}