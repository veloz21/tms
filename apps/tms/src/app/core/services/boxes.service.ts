import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { BoxModel } from '@tms/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_BOXES_URL = environment.endpoint + 'api/workshop/boxes';
// Real REST API
@Injectable()
export class BoxesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  // Create
  createBox(box): Observable<BoxModel> {
    return this.http.post<BoxModel>(API_BOXES_URL, box);
  }

  // READ
  getAllBoxes(): Observable<BoxModel[]> {
    return this.http.get<BoxModel[]>(API_BOXES_URL);
  }

  getBoxById(boxId: number): Observable<BoxModel> {
    return this.http.get<BoxModel>(API_BOXES_URL + `/${boxId}`);
  }

  // Server should return filtered/sorted result
  findBoxes(queryParams: QueryParamsModel): Observable<BoxModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_BOXES_URL;
    return this.http.get<BoxModel[]>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE
  updateBox(box: BoxModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_BOXES_URL, box, { headers: httpHeaders });
  }
  // DELETE
  deleteBox(boxId: number): Observable<BoxModel> {
    const url = `${API_BOXES_URL}/${boxId}`;
    return this.http.delete<BoxModel>(url);
  }

  deleteBoxes(ids: number[] = []): Observable<any> {
    const url = API_BOXES_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { prdocutIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }

  findQueryBoxes(value: string): Observable<BoxModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    return this.http.get<BoxModel[]>(API_BOXES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as BoxModel[]);
      })
    );
  }
}
