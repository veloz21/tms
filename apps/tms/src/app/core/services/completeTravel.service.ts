import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpUtilsService,
  QueryParamsModel,
  QueryResultsModel,
} from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TravelModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_TRAVELS_URL = environment.endpoint + 'api/travels';

@Injectable()
export class TravelsService extends HttpService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(
    new QueryParamsModel({}, 'asc', '', 0, 10)
  );

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
    super();
  }

  createTravel(travel): Observable<TravelModel> {
    return this.http
      .post<TravelModel>(API_TRAVELS_URL, travel, this.httpOptions)
      .pipe(catchError(this.handleError('createTravel')));
  }

  getAllTravels(): Observable<TravelModel[]> {
    return this.http
      .get<TravelModel[]>(API_TRAVELS_URL, this.httpOptions)
      .pipe(catchError(this.handleError('getAllTravels')));
  }

  getTravelById(travelId: string): Observable<TravelModel> {
    return this.http
      .get<TravelModel>(`${API_TRAVELS_URL}/${travelId}`, this.httpOptions)
      .pipe(catchError(this.handleError('getTravelById')));
  }

  findTravels(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TRAVELS_URL;
    return this.http
      .get<QueryResultsModel>(url, {
        headers: this.httpOptions.headers,
        params: httpParams,
      })
      .pipe(catchError(this.handleError('findTravels')));
  }

  updateTravel(travel: TravelModel): Observable<any> {
    return this.http
      .put(`${API_TRAVELS_URL}/${travel.id}`, travel, this.httpOptions)
      .pipe(catchError(this.handleError('updateTravel')));
  }

  deleteTravel(travelId: string): Observable<TravelModel> {
    return this.http
      .delete<TravelModel>(`${API_TRAVELS_URL}/${travelId}`, this.httpOptions)
      .pipe(catchError(this.handleError('deleteTravel')));
  }

  deleteTravels(ids: string[] = []): Observable<any> {
    const requests: Observable<TravelModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteTravel(ids[index]));
    }
    return forkJoin(requests);
  }
}
