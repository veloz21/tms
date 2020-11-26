import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { Truck } from '@interfaces';
import { TruckModel } from '@models';
import { each } from 'lodash';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_TRUCKS_URL = 'api/trucks';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class TrucksService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient,
              private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new truck to the server
  createTruck(truck): Observable<Truck> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<Truck>(API_TRUCKS_URL, truck, { headers: httpHeaders });
  }

  // READ
  getAllTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(API_TRUCKS_URL);
  }

  getTruckById(truckId: number): Observable<Truck> {
    return this.http.get<Truck>(API_TRUCKS_URL + `/${truckId}`);
  }

  findTrucks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    return this.getAllTrucks().pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
        return of(result);
      })
    );
  }

  updateStatusForTruck(trucks: Truck[], status: number): Observable < any > {
		const tasks$ = [];
		each(trucks, element => {
      const _truck = Object.assign({}, element);
      _truck.status = status;
      tasks$.push(this.updateTruck(_truck));
		});
		return forkJoin(tasks$);
	}
  // UPDATE => PUT: update the truck on the server
  updateTruck(truck: Truck): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_TRUCKS_URL, truck, { headers: httpHeaders });
  }

  // DELETE => delete the product from the server
  deleteTruck(truckId: number): Observable<Truck> {
    const url = `${API_TRUCKS_URL}/${truckId}`;
    return this.http.delete<Truck>(url);
  }

  deleteTrucks(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    const length = ids.length;
    for (let i = 0; i < length; i++) {
      tasks$.push(this.deleteTruck(ids[i]));
    }
    return forkJoin(tasks$);
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
