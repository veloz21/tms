export interface IQueryParams {
  filter: { [key: string]: string | string[] };
  sortOrder: string;
  sortField: string;
  pageNumber: number;
  pageSize: number;
}
