import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { BoxModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_BOXES_URL = environment.endpoint + 'api/workshop/boxes';

@Injectable()
export class BoxesService extends HttpService {
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

  createBox(box): Observable<BoxModel> {
    return this.http.post<BoxModel>(API_BOXES_URL, box, this.httpOptions).pipe(
      catchError(this.handleError('createBox'))
    );
  }

  getAllBoxes(): Observable<BoxModel[]> {
    return this.http.get<BoxModel[]>(API_BOXES_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllBoxes'))
    );
  }

  getBoxById(boxId: string): Observable<BoxModel> {
    return this.http.get<BoxModel>(API_BOXES_URL + `/${boxId}`, this.httpOptions).pipe(
      catchError(this.handleError('getBoxById'))
    );
  }

  findBoxes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_BOXES_URL;
    return this.http.get<QueryResultsModel>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findBoxes'))
    );
  }

  updateBox(box: BoxModel): Observable<any> {
    return this.http.put(API_BOXES_URL, box, this.httpOptions).pipe(
      catchError(this.handleError('updateBox'))
    );
  }

  deleteBox(boxId: string): Observable<BoxModel> {
    return this.http.delete<BoxModel>(`${API_BOXES_URL}/${boxId}`, this.httpOptions).pipe(
      catchError(this.handleError('deleteBox'))
    );
  }

  deleteBoxes(ids: string[] = []): Observable<any> {
    const requests: Observable<BoxModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteBox(ids[index]));
    }
    return forkJoin(requests);
  }

  findQueryBoxes(value: string): Observable<BoxModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<BoxModel[]>(API_BOXES_URL, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findQueryBoxes'))
    );
  }
}
