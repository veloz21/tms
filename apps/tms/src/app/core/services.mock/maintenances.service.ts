import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { Maintenance } from '@interfaces';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_MAINTENANCES_URL = 'api/maintenances';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class MaintenancesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient,
              private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new maintenance to the server
  createMaintenance(maintenance): Observable<Maintenance> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<Maintenance>(API_MAINTENANCES_URL, maintenance, { headers: httpHeaders });
  }

  // READ
  getAllMaintenances(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(API_MAINTENANCES_URL);
  }

  getMaintenanceById(maintenanceId: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(API_MAINTENANCES_URL + `/${maintenanceId}`);
  }

  findMaintenances(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    return this.getAllMaintenances().pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
        return of(result);
      })
    );
  }

  // UPDATE => PUT: update the maintenance on the server
  updateMaintenance(maintenance: Maintenance): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_MAINTENANCES_URL, maintenance, { headers: httpHeaders });
  }

  // DELETE => delete the product from the server
  deleteMaintenance(maintenanceId: number): Observable<Maintenance> {
    const url = `${API_MAINTENANCES_URL}/${maintenanceId}`;
    return this.http.delete<Maintenance>(url);
  }

  deleteMaintenances(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    const length = ids.length;
    for (let i = 0; i < length; i++) {
      tasks$.push(this.deleteMaintenance(ids[i]));
    }
    return forkJoin(tasks$);
  }
}
