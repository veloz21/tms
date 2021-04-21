import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { UserModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_USERS_URL = environment.endpoint + 'api/admin/users';

@Injectable()
export class UsersService extends HttpService {
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

  createUser(user): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user, this.httpOptions).pipe(
      catchError(this.handleError('createUser'))
    );
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllUsers'))
    );
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${API_USERS_URL}/${userId}`, this.httpOptions).pipe(
      catchError(this.handleError('getUserById'))
    );
  }

  findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_USERS_URL;
    return this.http.get<QueryResultsModel>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findUsers'))
    );
  }

  updateUser(user: UserModel): Observable<any> {
    return this.http.put(`${API_USERS_URL}/${user.id}`, user, this.httpOptions).pipe(
      catchError(this.handleError('updateUser'))
    );
  }

  deleteUser(userId: string): Observable<UserModel> {
    return this.http.delete<UserModel>(`${API_USERS_URL}/${userId}`, this.httpOptions).pipe(
      catchError(this.handleError('deleteUser'))
    );
  }

  deleteUsers(ids: string[] = []): Observable<any> {
    const requests: Observable<UserModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteUser(ids[index]));
    }
    return forkJoin(requests);
  }

  public findQueryUsers(value: string): Observable<QueryResultsModel> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<QueryResultsModel>(API_USERS_URL, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findQueryUsers'))
    );
  }
}
