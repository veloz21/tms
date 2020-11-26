export interface IQueryParams {
  filter: { [key: string]: string; };
  sortOrder: string;
  sortField: string;
  pageNumber: number;
  pageSize: number;
}