import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TravelModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_COMPLETED_TRAVELS_URL = environment.endpoint + 'api/completed-travels';

@Injectable()
export class CompletedTravelService extends HttpService {
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

  createCompletedTravel(completedTravel): Observable<TravelModel> {
    return this.http.post<TravelModel>(API_COMPLETED_TRAVELS_URL, completedTravel, this.httpOptions).pipe(catchError(this.handleError('createCompletedTravel')));
  }

  getAllCompletedTravel(): Observable<TravelModel[]> {
    return this.http.get<TravelModel[]>(API_COMPLETED_TRAVELS_URL, this.httpOptions).pipe(catchError(this.handleError('getAllCompletedTravel')));
  }

  getCompletedTravelById(completedTravelId: string): Observable<TravelModel> {
    return this.http.get<TravelModel>(`${API_COMPLETED_TRAVELS_URL}/${completedTravelId}`, this.httpOptions).pipe(catchError(this.handleError('getCompletedTravelById')));
  }

  findCompletedTravel(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_COMPLETED_TRAVELS_URL;
    return this.http
      .get<QueryResultsModel>(url, {
        headers: this.httpOptions.headers,
        params: httpParams,
      })
      .pipe(catchError(this.handleError('findCompletedTravel')));
  }

  updateCompletedTravel(completedTravel: TravelModel): Observable<any> {
    return this.http.put(`${API_COMPLETED_TRAVELS_URL}/${completedTravel.id}`, completedTravel, this.httpOptions).pipe(catchError(this.handleError('updateCompletedTravel')));
  }

  deleteCompletedTravel(completedTravelId: string): Observable<TravelModel> {
    return this.http.delete<TravelModel>(`${API_COMPLETED_TRAVELS_URL}/${completedTravelId}`, this.httpOptions).pipe(catchError(this.handleError('deleteCompletedTravel')));
  }

  deleteCompletedTravels(ids: string[] = []): Observable<any> {
    const requests: Observable<TravelModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteCompletedTravel(ids[index]));
    }
    return forkJoin(requests);
  }
}
