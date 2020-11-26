import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment.dev';
import { EmployeeModel } from '@tms/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_EMPLOYEES_URL = environment.endpoint + 'api/paysheet/employees';
// Real REST API
@Injectable()
export class EmployeesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  // Create
  createEmployee(employee): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(API_EMPLOYEES_URL, employee);
  }

  // READ
  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(API_EMPLOYEES_URL);
  }

  getEmployeeById(employeeId: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(API_EMPLOYEES_URL + `/${employeeId}`);
  }

  // Server should return filtered/sorted result
  findEmployees(queryParams: QueryParamsModel): Observable<EmployeeModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_EMPLOYEES_URL;
    return this.http.get<EmployeeModel[]>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE
  updateEmployee(employee: EmployeeModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_EMPLOYEES_URL, employee, { headers: httpHeaders });
  }
  // DELETE
  deleteEmployee(employeeId: number): Observable<EmployeeModel> {
    const url = `${API_EMPLOYEES_URL}/${employeeId}`;
    return this.http.delete<EmployeeModel>(url);
  }

  deleteEmployees(ids: number[] = []): Observable<any> {
    const url = API_EMPLOYEES_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { prdocutIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }

  findQueryEmployees(value: string): Observable<EmployeeModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'fristName',
    );
    return this.http.get<EmployeeModel[]>(API_EMPLOYEES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        console.log(result);
        return of(result.items as EmployeeModel[]);
      })
    );
  }
}
