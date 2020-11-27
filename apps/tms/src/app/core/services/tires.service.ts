import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TireModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_TIRES_URL = environment.endpoint + 'api/workshop/tires';

@Injectable()
export class TiresService extends HttpService {
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

  createTire(tire): Observable<TireModel> {
    return this.http.post<TireModel>(API_TIRES_URL, tire, this.httpOptions).pipe(
      catchError(this.handleError('createTire'))
    );
  }

  getAllTires(): Observable<TireModel[]> {
    return this.http.get<TireModel[]>(API_TIRES_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllTires'))
    );
  }

  getTireById(tireId: string): Observable<TireModel> {
    return this.http.get<TireModel>(`${API_TIRES_URL}/${tireId}`, this.httpOptions).pipe(
      catchError(this.handleError('getTireById'))
    );
  }

  findTires(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TIRES_URL;
    return this.http.get<QueryResultsModel>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findTires'))
    );
  }

  updateTire(tire: TireModel): Observable<any> {
    return this.http.put(`${API_TIRES_URL}/${tire.id}`, tire, this.httpOptions).pipe(
      catchError(this.handleError('updateTire'))
    );
  }

  deleteTire(tireId: string): Observable<TireModel> {
    return this.http.delete<TireModel>(`${API_TIRES_URL}/${tireId}`, this.httpOptions).pipe(
      catchError(this.handleError('deleteTire'))
    );
  }

  deleteTires(ids: string[] = []): Observable<any> {
    const requests: Observable<TireModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteTire(ids[index]));
    }
    return forkJoin(requests);
  }

  public findQueryTires(value: string): Observable<QueryResultsModel> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<QueryResultsModel>(API_TIRES_URL, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findQueryTires'))
    );
  }
}
