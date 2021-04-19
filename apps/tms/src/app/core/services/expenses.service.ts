import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { ExpenseModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_EXPENSES_URL = environment.endpoint + 'api/expenses';

@Injectable()
export class ExpensesService extends HttpService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
    super();
  }

  createExpenses(expenses): Observable<ExpenseModel> {
    return this.http.post<ExpenseModel>(API_EXPENSES_URL, expenses, this.httpOptions).pipe(catchError(this.handleError('createExpenses')));
  }

  getAllExpenses(): Observable<ExpenseModel[]> {
    return this.http.get<ExpenseModel[]>(API_EXPENSES_URL, this.httpOptions).pipe(catchError(this.handleError('getAllExpenses')));
  }

  getExpensesById(expensesId: string): Observable<ExpenseModel> {
    return this.http.get<ExpenseModel>(`${API_EXPENSES_URL}/${expensesId}`, this.httpOptions).pipe(catchError(this.handleError('getExpensesById')));
  }

  findExpenses(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_EXPENSES_URL;
    return this.http
      .get<QueryResultsModel>(url, {
        headers: this.httpOptions.headers,
        params: httpParams,
      })
      .pipe(catchError(this.handleError('findExpenses')));
  }

  updateExpenses(expenses: ExpenseModel): Observable<any> {
    return this.http.put(`${API_EXPENSES_URL}/${expenses.id}`, expenses, this.httpOptions).pipe(catchError(this.handleError('updateBox')));
  }

  deleteExpenses(expensesId: string): Observable<ExpenseModel> {
    return this.http.delete<ExpenseModel>(`${API_EXPENSES_URL}/${expensesId}`, this.httpOptions).pipe(catchError(this.handleError('deleteBox')));
  }

  deleteManyExpenses(ids: string[] = []): Observable<any> {
    const requests: Observable<ExpenseModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteExpenses(ids[index]));
    }
    return forkJoin(requests);
  }
}
