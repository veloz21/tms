import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TruckModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_TRUCKS_URL = environment.endpoint + 'api/workshop/trucks';

@Injectable()
export class TrucksService extends HttpService {
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

  createTruck(truck): Observable<TruckModel> {
    return this.http.post<TruckModel>(API_TRUCKS_URL, truck, this.httpOptions).pipe(
      catchError(this.handleError('createTruck'))
    );
  }

  getAllTrucks(): Observable<TruckModel[]> {
    return this.http.get<TruckModel[]>(API_TRUCKS_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllTrucks'))
    );
  }

  getTruckById(truckId: string): Observable<TruckModel> {
    return this.http.get<TruckModel>(`${API_TRUCKS_URL}/${truckId}`, this.httpOptions).pipe(
      catchError(this.handleError('getTruckById'))
    );
  }

  findTrucks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TRUCKS_URL;
    return this.http.get<QueryResultsModel>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findTrucks'))
    );
  }

  updateTruck(truck: TruckModel): Observable<any> {
    return this.http.put(`${API_TRUCKS_URL}/${truck.id}`, truck, this.httpOptions).pipe(
      catchError(this.handleError('updateTruck'))
    );
  }

  deleteTruck(truckId: string): Observable<TruckModel> {
    return this.http.delete<TruckModel>(`${API_TRUCKS_URL}/${truckId}`, this.httpOptions).pipe(
      catchError(this.handleError('deleteTruck'))
    );
  }

  deleteTrucks(ids: string[] = []): Observable<any> {
    const requests: Observable<TruckModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteTruck(ids[index]));
    }
    return forkJoin(requests);
  }

  public findQueryTrucks(value: string): Observable<QueryResultsModel> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<QueryResultsModel>(API_TRUCKS_URL, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findQueryTrucks'))
    );
  }
}
