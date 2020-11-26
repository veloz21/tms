import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { Travel } from '@interfaces';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_TRAVELS_URL = 'api/travels';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class TravelsService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(
    new QueryParamsModel({}, 'asc', '', 0, 10)
  );

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  // CREATE =>  POST: add a new truck to the server
  createTravel(travel): Observable<Travel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<Travel>(API_TRAVELS_URL, travel, {
      headers: httpHeaders,
    });
  }

  // READ
  getAllTravels(): Observable<Travel[]> {
    return this.http.get<Travel[]>(API_TRAVELS_URL);
  }

  getTravelById(travelId: number): Observable<Travel> {
    return this.http.get<Travel>(API_TRAVELS_URL + `/${travelId}`);
  }

  findTravels(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    return this.getAllTravels().pipe(
      mergeMap((res) => {
        const result = this.httpUtils.baseFilter(res, queryParams, [
          'status',
          'condition',
        ]);
        return of(result);
      })
    );
  }

  // UPDATE => PUT: update the truck on the server
  updateTravel(travel: Travel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_TRAVELS_URL, travel, { headers: httpHeaders });
  }

  // DELETE => delete the product from the server
  deleteTravel(travelId: number): Observable<Travel> {
    const url = `${API_TRAVELS_URL}/${travelId}`;
    return this.http.delete<Travel>(url);
  }

  deleteTravels(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    const length = ids.length;
    for (let i = 0; i < length; i++) {
      tasks$.push(this.deleteTravel(ids[i]));
    }
    return forkJoin(tasks$);
  }
}
