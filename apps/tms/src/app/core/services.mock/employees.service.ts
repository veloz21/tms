import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { Employee } from '@interfaces';
import { each } from 'lodash';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_EMPLOYEES_URL = 'api/employees';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class EmployeesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(
    new QueryParamsModel({}, 'asc', '', 0, 10)
  );

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  // CREATE =>  POST: add a new product to the server
  createEmployee(employee): Observable<Employee> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<Employee>(API_EMPLOYEES_URL, employee, {
      headers: httpHeaders,
    });
  }

  // READ
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API_EMPLOYEES_URL);
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(
      API_EMPLOYEES_URL + `/${employeeId}`
    );
  }

  findEmployees(
    queryParams: QueryParamsModel
  ): Observable<QueryResultsModel> {
    return this.getAllEmployees().pipe(
      mergeMap((res) => {
        const result = this.httpUtils.baseFilter(res, queryParams, [
          'status',
          'condition',
        ]);
        return of(result);
      })
    );
  }

  // UPDATE => PUT: update the employee on the server
  updateEmployee(employee: Employee): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_EMPLOYEES_URL, employee, {
      headers: httpHeaders,
    });
  }

  // DELETE => delete the product from the server
  deleteEmployee(employeeId: number): Observable<Employee> {
    const url = `${API_EMPLOYEES_URL}/${employeeId}`;
    return this.http.delete<Employee>(url);
  }

  deleteEmployees(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    const length = ids.length;
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < length; i++) {
      tasks$.push(this.deleteEmployee(ids[i]));
    }
    return forkJoin(tasks$);
  }

  updateStatusForEmployee(employees: Employee[], status: number): Observable < any > {
		const tasks$ = [];
		each(employees, element => {
      const _employee = Object.assign({}, element);
      _employee.status = status;
      tasks$.push(this.updateEmployee(_employee));
		});
		return forkJoin(tasks$);
	}

	public findQueryEmployees(value: string): Observable<Employee[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'id',
    );
    return this.http.get<Employee[]>(API_EMPLOYEES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as Employee[]);
      })
    );
  }
}
