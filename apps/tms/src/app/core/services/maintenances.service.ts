import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { MaintenanceModel } from '@tms/models';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http-service';

const API_MAINTENANCE_URL = environment.endpoint + 'api/workshop/maintenances';

@Injectable()
export class MaintenancesService extends HttpService {
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

  createMaintenance(maintenance): Observable<MaintenanceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<MaintenanceModel>(API_MAINTENANCE_URL, maintenance, this.httpOptions).pipe(
      catchError(this.handleError('createMaintenance'))
    );
  }

  getAllMaintenances(): Observable<MaintenanceModel[]> {
    return this.http.get<MaintenanceModel[]>(API_MAINTENANCE_URL, this.httpOptions).pipe(
      catchError(this.handleError('getAllMaintenances'))
    );
  }

  getMaintenanceById(maintenanceId: string): Observable<MaintenanceModel> {
    return this.http.get<MaintenanceModel>(API_MAINTENANCE_URL + `/${maintenanceId}`, this.httpOptions).pipe(
      catchError(this.handleError('getMaintenanceById'))
    );
  }

  findMaintenances(queryParams: QueryParamsModel): Observable<MaintenanceModel[]> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_MAINTENANCE_URL;
    return this.http.get<MaintenanceModel[]>(url, {
      headers: this.httpOptions.headers,
      params: httpParams
    }).pipe(
      catchError(this.handleError('findMaintenances'))
    );
  }

  updateMaintenance(maintenance: MaintenanceModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_MAINTENANCE_URL, maintenance, this.httpOptions).pipe(
      catchError(this.handleError('updateMaintenance'))
    );
  }

  deleteMaintenance(maintenanceId: string): Observable<MaintenanceModel> {
    const url = `${API_MAINTENANCE_URL}/${maintenanceId}`;
    return this.http.delete<MaintenanceModel>(url, this.httpOptions).pipe(
      catchError(this.handleError('deleteMaintenance'))
    );
  }

  deleteMaintenances(ids: string[] = []): Observable<any> {
    const requests: Observable<MaintenanceModel>[] = [];
    for (let index = 0; index < ids.length; index++) {
      requests.push(this.deleteMaintenance(ids[index]));
    }
    return forkJoin(requests);
  }
}
