import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { EmployeeModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_EMPLOYEES_URL = environment.endpoint + 'api/paysheet/employees';

@Injectable()
export class EmployeesService extends HttpService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) {
    super();
  }

  createEmployee(employee): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(API_EMPLOYEES_URL, employee, this.httpOptions).pipe(
      catchError(this.handleError('createEmployee'))
    );
  }

  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(API_EMPLOYEES_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllEmployees'))
    );
  }

  getEmployeeById(employeeId: string): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(API_EMPLOYEES_URL + `/${employeeId}`).pipe(
      catchError(this.handleError('getEmployeeById'))
    );
  }

  findEmployees(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_EMPLOYEES_URL;
    return this.http.get<QueryResultsModel>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findEmployees'))
    );
  }

  updateEmployee(employee: EmployeeModel): Observable<EmployeeModel> {
    return this.http.put(API_EMPLOYEES_URL, employee, this.httpOptions).pipe(
      catchError(this.handleError('updateEmployee'))
    );
  }

  deleteEmployee(employeeId: string): Observable<EmployeeModel> {
    const url = `${API_EMPLOYEES_URL}/${employeeId}`;
    return this.http.delete<EmployeeModel>(url, this.httpOptions).pipe(
      catchError(this.handleError('deleteEmployee'))
    );
  }

  deleteEmployees(ids: string[] = []): Observable<any> {
    const requests: Observable<EmployeeModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteEmployee(ids[index]));
    }
    return forkJoin(requests);
  }

  findQueryEmployees(value: string): Observable<EmployeeModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'fristName',
    );
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<EmployeeModel[]>(API_EMPLOYEES_URL, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findQueryEmployees'))
    );
  }
}
