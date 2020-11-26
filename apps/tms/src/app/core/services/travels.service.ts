import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { TravelModel } from '@tms/models';
import { BehaviorSubject, Observable } from 'rxjs';

const API_TRAVELS_URL = environment.endpoint + 'api/travels';
// Real REST API
@Injectable()
export class TravelsService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(
    new QueryParamsModel({}, 'asc', '', 0, 10)
  );

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  // CREATE =>  POST: add a new product to the server
  createTravel(travel): Observable<TravelModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<TravelModel>(API_TRAVELS_URL, travel, {
      headers: httpHeaders,
    });
  }

  // READ
  getAllTravels(): Observable<TravelModel[]> {
    return this.http.get<TravelModel[]>(API_TRAVELS_URL);
  }

  getTravelById(travelId: number): Observable<TravelModel> {
    return this.http.get<TravelModel>(API_TRAVELS_URL + `/${travelId}`);
  }

  // Server should return filtered/sorted result
  findTravels(queryParams: QueryParamsModel): Observable<TravelModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_TRAVELS_URL;
    return this.http.get<TravelModel[]>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  // UPDATE => PUT: update the Travel on the server
  updateTravel(travel: TravelModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_TRAVELS_URL, travel, { headers: httpHeaders });
  }

  // DELETE => delete the Travel from the server
  deleteTravel(travelId: number): Observable<TravelModel> {
    const url = `${API_TRAVELS_URL}/${travelId}`;
    return this.http.delete<TravelModel>(url);
  }

  deleteTravels(ids: number[] = []): Observable<any> {
    const url = API_TRAVELS_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { prdocutIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, {
      headers: httpHeaders,
    });
  }
}
