import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { CompletedTravelModel } from '../models/completed-travel.model';

export enum CompletedTravelActionTypes {
  GetCompletedTravel = '[Edit CompletedTravel Component] Get CompletedTravel',
  StoreCompletedTravel = '[Edit CompletedTravel Component] Store CompletedTravel',
  CreateCompletedTravel = '[Edit CompletedTravel Component] Create CompletedTravel ',
  CreateCompletedTravelError = '[Edit CompletedTravel Component] Create CompletedTravel Error',
  CreateCompletedTravelSuccess = '[Edit CompletedTravel Component] Create CompletedTravel Success',
  UpdateCompletedTravel = '[Edit CompletedTravel Component] Update CompletedTravel ',
  UpdateCompletedTravelSuccess = '[Edit CompletedTravel Component] Update CompletedTravel Success ',
  DeleteOneCompletedTravel = '[CompletedTravels List Page] One CompletedTravel Deleted',
  DeleteManyCompletedTravels = '[CompletedTravels List Page] Many Selected CompletedTravels Deleted',
  RequestCompletedTravelsPage = '[CompletedTravels List Page] CompletedTravels Page Requested',
  LoadCompletedTravelPage = '[CompletedTravels API] CompletedTravels Page Loaded',
  CancelCompletedTravelPage = '[CompletedTravels API] CompletedTravels Page Cancelled',
  CompletedTravelPageToggleLoading = '[CompletedTravels] CompletedTravels Page Toggle Loading',
  CompletedTravelActionToggleLoading = '[CompletedTravels] CompletedTravels Action Toggle Loading',
}

export class GetCompletedTravel implements Action {
  readonly type = CompletedTravelActionTypes.GetCompletedTravel;
  constructor(public payload: { id: string }) { }
}

export class StoreCompletedTravel implements Action {
  readonly type = CompletedTravelActionTypes.StoreCompletedTravel;
  constructor(public payload: { completedTravel: CompletedTravelModel }) { }
}

export class CreateCompletedTravel implements Action {
  readonly type = CompletedTravelActionTypes.CreateCompletedTravel;
  constructor(public payload: { completedTravel: CompletedTravelModel; }) { }
}

export class CreateCompletedTravelError implements Action {
  readonly type = CompletedTravelActionTypes.CreateCompletedTravelError;
  constructor(public payload: { isError: any; }) { }
}

export class CreateCompletedTravelSuccess implements Action {
  readonly type = CompletedTravelActionTypes.CreateCompletedTravelSuccess;
  constructor(public payload: { completedTravel: CompletedTravelModel; }) { }
}

export class UpdateCompletedTravel implements Action {
  readonly type = CompletedTravelActionTypes.UpdateCompletedTravel;
  constructor(
    public payload: {
      partialCompletedTravel: Update<CompletedTravelModel>; // For State update
      completedTravel: CompletedTravelModel; // For Server update (through service)
    }
  ) { }
}

export class UpdateCompletedTravelSuccess implements Action {
  readonly type = CompletedTravelActionTypes.UpdateCompletedTravelSuccess;
  constructor(
    public payload: {
      partialCompletedTravel: Update<CompletedTravelModel>; // For State update
      completedTravel: CompletedTravelModel; // For Server update (through service)
    }
  ) { }
}

export class DeleteOneCompletedTravel implements Action {
  readonly type = CompletedTravelActionTypes.DeleteOneCompletedTravel;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyCompletedTravels implements Action {
  readonly type = CompletedTravelActionTypes.DeleteManyCompletedTravels;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestCompletedTravelsPage implements Action {
  readonly type = CompletedTravelActionTypes.RequestCompletedTravelsPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadCompletedTravelPage implements Action {
  readonly type = CompletedTravelActionTypes.LoadCompletedTravelPage;
  constructor(
    public payload: {
      completedTravels: CompletedTravelModel[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) { }
}

export class CancelCompletedTravelPage implements Action {
  readonly type = CompletedTravelActionTypes.CancelCompletedTravelPage;
}

export class CompletedTravelPageToggleLoading implements Action {
  readonly type = CompletedTravelActionTypes.CompletedTravelPageToggleLoading;
  constructor(public payload: { isLoading: boolean; }) { }
}

export class CompletedTravelActionToggleLoading implements Action {
  readonly type = CompletedTravelActionTypes.CompletedTravelActionToggleLoading;
  constructor(public payload: { isLoading: boolean; }) { }
}

export type CompletedTravelActions =
  | CreateCompletedTravel
  | UpdateCompletedTravel
  | DeleteOneCompletedTravel
  | DeleteManyCompletedTravels
  | RequestCompletedTravelsPage
  | LoadCompletedTravelPage
  | CancelCompletedTravelPage
  | CompletedTravelPageToggleLoading
  | CompletedTravelActionToggleLoading
  | CreateCompletedTravelError
  | CreateCompletedTravelSuccess
  | UpdateCompletedTravelSuccess
  ;
