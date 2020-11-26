import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TruckModel } from '@tms/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_TRUCKS_URL = environment.endpoint + 'api/workshop/trucks';
// Real REST API
@Injectable()
export class TrucksService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new product to the server
  createTruck(truck): Observable<TruckModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<TruckModel>(API_TRUCKS_URL, truck, { headers: httpHeaders });
  }

  // READ
  getAllTrucks(): Observable<TruckModel[]> {
    return this.http.get<TruckModel[]>(API_TRUCKS_URL);
  }

  getTruckById(truckId: number): Observable<TruckModel> {
    return this.http.get<TruckModel>(API_TRUCKS_URL + `/${truckId}`);
  }

  // Server should return filtered/sorted result
  findTrucks(queryParams: QueryParamsModel): Observable<TruckModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TRUCKS_URL;
    return this.http.get<TruckModel[]>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the Truck on the server
  updateTruck(truck: TruckModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_TRUCKS_URL, truck, { headers: httpHeaders });
  }

  // DELETE => delete the Truck from the server
  deleteTruck(truckId: number): Observable<TruckModel> {
    const url = `${API_TRUCKS_URL}/${truckId}`;
    return this.http.delete<TruckModel>(url);
  }

  deleteTrucks(ids: number[] = []): Observable<any> {
    const url = API_TRUCKS_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { truckIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }

  public findQueryTrucks(value: string): Observable<TruckModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    return this.http.get<TruckModel[]>(API_TRUCKS_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as TruckModel[]);
      })
    );
  }
}
