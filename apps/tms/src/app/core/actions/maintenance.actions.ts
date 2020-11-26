import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { MaintenanceModel } from '@tms/models';

export enum MaintenanceActionTypes {
  CreateMaintenance = '[Edit Maintenance Component] Create Maintenance',
  UpdateMaintenance = '[Edit Maintenance Component] Update Maintenance',
  DeleteOneMaintenance = '[Maintenance List Page] Delete One Maintenance',
  DeleteManyMaintenances = '[Maintenances List Page] Delete Many Maintenances',
  RequestMaintenancesPage = '[Maintenances List Page] Request Maintenances Page',
  LoadMaintenancesPage = '[Maintenances API] Load Maintenances Page',
  CancelMaintenancesPage = '[Maintenances API] Cancel Maintenances Page',
  MaintenancesPageToggleLoading = '[Maintenances] Maintenances Page Toggle Loading',
  MaintenancesActionToggleLoading = '[Maintenances] Maintenances Action Toggle Loading',
  CreateMaintenanceSuccess = '[Edit Maintenance Component] Create Maintenance Success',
  CreateMaintenanceError = '[Edit Maintenance Component] Create Maintenance Error',
  UpdateMaintenanceSuccess = '[Edit Travel Component] Update Travel Success'
}

export class CreateMaintenance implements Action {
  readonly type = MaintenanceActionTypes.CreateMaintenance;
  constructor(public payload: { maintenance: MaintenanceModel }) { }
}

export class CreateMaintenanceSuccess implements Action {
  readonly type = MaintenanceActionTypes.CreateMaintenanceSuccess;
  constructor(public payload: { maintenance: MaintenanceModel }) { }
}

export class CreateMaintenanceError implements Action {
  readonly type = MaintenanceActionTypes.CreateMaintenanceError;
  constructor(public payload: { error: any }) { }
}

export class UpdateMaintenance implements Action {
  readonly type = MaintenanceActionTypes.UpdateMaintenance;
  constructor(public payload: {
    partialMaintenance: Update<MaintenanceModel>, // For State update
    maintenance: MaintenanceModel // For Server update (through service)
  }) { }
}

export class UpdateMaintenanceSuccess implements Action {
  readonly type = MaintenanceActionTypes.UpdateMaintenanceSuccess;
  constructor(public payload: {
    partialMaintenance: Update<MaintenanceModel>, // For State update
    maintenance: MaintenanceModel // For Server update (through service)
  }) { }
}

export class DeleteOneMaintenance implements Action {
  readonly type = MaintenanceActionTypes.DeleteOneMaintenance;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyMaintenances implements Action {
  readonly type = MaintenanceActionTypes.DeleteManyMaintenances;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestMaintenancesPage implements Action {
  readonly type = MaintenanceActionTypes.RequestMaintenancesPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadMaintenancesPage implements Action {
  readonly type = MaintenanceActionTypes.LoadMaintenancesPage;
  constructor(public payload: { maintenance: MaintenanceModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class CancelMaintenancesPage implements Action {
  readonly type = MaintenanceActionTypes.CancelMaintenancesPage;
}

export class MaintenancesPageToggleLoading implements Action {
  readonly type = MaintenanceActionTypes.MaintenancesPageToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export class MaintenancesActionToggleLoading implements Action {
  readonly type = MaintenanceActionTypes.MaintenancesActionToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export type MaintenanceActions =
  | CreateMaintenance
  | UpdateMaintenance
  | DeleteOneMaintenance
  | DeleteManyMaintenances
  | RequestMaintenancesPage
  | LoadMaintenancesPage
  | CancelMaintenancesPage
  | MaintenancesPageToggleLoading
  | MaintenancesActionToggleLoading
  | CreateMaintenanceSuccess
  | CreateMaintenanceError
  | UpdateMaintenanceSuccess
  ;

