import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TireModel } from '@tms/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_TIRES_URL = environment.endpoint + 'api/workshop/tires';
// Real REST API
@Injectable()
export class TiresService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  // Create
  createTire(tire): Observable<TireModel> {
    return this.http.post<TireModel>(API_TIRES_URL, tire);
  }

  // READ
  getAllTires(): Observable<TireModel[]> {
    return this.http.get<TireModel[]>(API_TIRES_URL);
  }

  getTireById(tireId: number): Observable<TireModel> {
    return this.http.get<TireModel>(API_TIRES_URL + `/${tireId}`);
  }

  // Server should return filtered/sorted result
  findTires(queryParams: QueryParamsModel): Observable<TireModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TIRES_URL;
    return this.http.get<TireModel[]>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE
  updateTire(tire: TireModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_TIRES_URL, tire, { headers: httpHeaders });
  }
  // DELETE
  deleteTire(tireId: string): Observable<TireModel> {
    const url = `${API_TIRES_URL}/${tireId}`;
    return this.http.delete<TireModel>(url);
  }

  deleteTires(ids: number[] = []): Observable<any> {
    const url = API_TIRES_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { prdocutIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }

  public findQueryTires(value: string): Observable<TireModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    return this.http.get<TireModel[]>(API_TIRES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as TireModel[]);
      })
    );
  }
}
