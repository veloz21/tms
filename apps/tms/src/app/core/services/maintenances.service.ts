import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@tms/crud';
import { environment } from '@tms/environments/environment';
import { MaintenanceModel } from '@tms/models';
import { BehaviorSubject, Observable } from 'rxjs';

const API_MAINTENANCE_URL = environment.endpoint + 'api/workshop/maintenances';
// Real REST API
@Injectable()
export class MaintenancesService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new product to the server
  createMaintenance(maintenance): Observable<MaintenanceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<MaintenanceModel>(API_MAINTENANCE_URL, maintenance, { headers: httpHeaders });
  }

  // READ
  getAllMaintenances(): Observable<MaintenanceModel[]> {
    return this.http.get<MaintenanceModel[]>(API_MAINTENANCE_URL);
  }

  getMaintenanceById(maintenanceId: number): Observable<MaintenanceModel> {
    return this.http.get<MaintenanceModel>(API_MAINTENANCE_URL + `/${maintenanceId}`);
  }

  // Server should return filtered/sorted result
  findMaintenances(queryParams: QueryParamsModel): Observable<MaintenanceModel[]> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_MAINTENANCE_URL;
    return this.http.get<MaintenanceModel[]>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the Maintenance on the server
  updateMaintenance(maintenance: MaintenanceModel): Observable<any> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_MAINTENANCE_URL, maintenance, { headers: httpHeaders });
  }

  // DELETE => delete the Maintenance from the server
  deleteMaintenance(maintenanceId: number): Observable<MaintenanceModel> {
    const url = `${API_MAINTENANCE_URL}/${maintenanceId}`;
    return this.http.delete<MaintenanceModel>(url);
  }

  deleteMaintenances(ids: number[] = []): Observable<any> {
    const url = API_MAINTENANCE_URL + '/delete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { maintenanceIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }
}
