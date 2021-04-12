import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { TruckModel } from '@tms/models';

export enum TruckActionTypes {
  GetTruck = '[Edit Truck Component] Get Truck',
  StoreTruck = '[Edit Truck Component] Store Truck',
  CreateTruck = '[Edit Truck Component] Truck Created',
  UpdateTruck = '[Edit Truck Component] Truck Updated',
  DeleteOneTruck = '[Truck List Page] One Truck Deleted',
  DeleteManyTrucks = '[Trucks List Page] Many Selected Trucks Deleted',
  RequestTrucksPage = '[Trucks List Page] Truck Page Requested',
  TrucksStatusUpdated = '[Trucks List Page] Trucks Status Updated',
  LoadTrucksPage = '[Trucks API] Trucks Page Loaded',
  CancelTrucksPage = '[Trucks API] Trucks Page Cancelled',
  TrucksPageToggleLoading = '[Trucks] Trucks Page Toggle Loading',
  TrucksActionToggleLoading = '[Trucks] Trucks Action Toggle Loading',
  CreateTruckSuccess = '[Edit Truck Component] Create Truck Success',
  CreateTruckError = '[Edit Truck Component] Create Truck Error',
  UpdateTruckSuccess = '[Edit Truck Component] Update Truck Success'
}

export class GetTruck implements Action {
  readonly type = TruckActionTypes.GetTruck;
  constructor(public payload: { id: string }) { }
}

export class StoreTruck implements Action {
  readonly type = TruckActionTypes.StoreTruck;
  constructor(public payload: { truck: TruckModel }) { }
}

export class CreateTruck implements Action {
  readonly type = TruckActionTypes.CreateTruck;
  constructor(public payload: { truck: TruckModel }) { }
}

export class CreateTruckSuccess implements Action {
  readonly type = TruckActionTypes.CreateTruckSuccess;
  constructor(public payload: { truck: TruckModel }) { }
}

export class CreateTruckError implements Action {
  readonly type = TruckActionTypes.CreateTruckError;
  constructor(public payload: { error: any }) { }
}

export class UpdateTruck implements Action {
  readonly type = TruckActionTypes.UpdateTruck;
  constructor(public payload: {
    partialTruck: Update<TruckModel>, // For State update
    truck: TruckModel // For Server update (through service)
  }) { }
}

export class UpdateTruckSuccess implements Action {
  readonly type = TruckActionTypes.UpdateTruckSuccess;
  constructor(public payload: {
    partialTruck: Update<TruckModel>, // For State update
    truck: TruckModel // For Server update (through service)
  }) { }
}

export class TrucksStatusUpdated implements Action {
  readonly type = TruckActionTypes.TrucksStatusUpdated;
  constructor(public payload: {
    trucks: TruckModel[],
    status: number
  }) { }
}

export class DeleteOneTruck implements Action {
  readonly type = TruckActionTypes.DeleteOneTruck;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyTrucks implements Action {
  readonly type = TruckActionTypes.DeleteManyTrucks;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestTrucksPage implements Action {
  readonly type = TruckActionTypes.RequestTrucksPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadTrucksPage implements Action {
  readonly type = TruckActionTypes.LoadTrucksPage;
  constructor(public payload: { trucks: TruckModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class CancelTrucksPage implements Action {
  readonly type = TruckActionTypes.CancelTrucksPage;
}

export class TrucksPageToggleLoading implements Action {
  readonly type = TruckActionTypes.TrucksPageToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export class TrucksActionToggleLoading implements Action {
  readonly type = TruckActionTypes.TrucksActionToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export type TruckActions =
  | CreateTruck
  | UpdateTruck
  | DeleteOneTruck
  | DeleteManyTrucks
  | TrucksStatusUpdated
  | RequestTrucksPage
  | LoadTrucksPage
  | CancelTrucksPage
  | TrucksPageToggleLoading
  | TrucksActionToggleLoading
  | CreateTruckSuccess
  | CreateTruckError
  | UpdateTruckSuccess
  | GetTruck
  | StoreTruck
  ;
