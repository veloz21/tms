import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TravelModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_COMPLETETRAVELS_URL = environment.endpoint + 'api/complete-travels';

@Injectable()
export class CompleteTravelService extends HttpService {
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

  createCompleteTravel(completeTravel): Observable<TravelModel> {
    return this.http.post<TravelModel>(API_COMPLETETRAVELS_URL, completeTravel, this.httpOptions).pipe(catchError(this.handleError('createCompleteTravel')));
  }

  getAllCompleteTravel(): Observable<TravelModel[]> {
    return this.http.get<TravelModel[]>(API_COMPLETETRAVELS_URL, this.httpOptions).pipe(catchError(this.handleError('getAllCompleteTravel')));
  }

  getCompleteTravelById(completeTravelId: string): Observable<TravelModel> {
    return this.http.get<TravelModel>(`${API_COMPLETETRAVELS_URL}/${completeTravelId}`, this.httpOptions).pipe(catchError(this.handleError('getCompleteTravelById')));
  }

  findCompleteTravel(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_COMPLETETRAVELS_URL;
    return this.http
      .get<QueryResultsModel>(url, {
        headers: this.httpOptions.headers,
        params: httpParams,
      })
      .pipe(catchError(this.handleError('findCompleteTravel')));
  }

  updateCompleteTravel(completeTravel: TravelModel): Observable<any> {
    return this.http.put(`${API_COMPLETETRAVELS_URL}/${completeTravel.id}`, completeTravel, this.httpOptions).pipe(catchError(this.handleError('updateCompleteTravel')));
  }

  deleteCompleteTravel(completeTravelId: string): Observable<TravelModel> {
    return this.http.delete<TravelModel>(`${API_COMPLETETRAVELS_URL}/${completeTravelId}`, this.httpOptions).pipe(catchError(this.handleError('deleteCompleteTravel')));
  }

  deleteCompleteTravels(ids: string[] = []): Observable<any> {
    const requests: Observable<TravelModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteCompleteTravel(ids[index]));
    }
    return forkJoin(requests);
  }
}
