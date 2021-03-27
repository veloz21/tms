import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { TravelModel, TravelStatusModel } from '@tms/models';

export enum CompleteTravelActionTypes {
  CreateCompleteTravel = '[Edit CompleteTravel Component] Create CompleteTravel ',
  CreateCompleteTravelError = '[Edit CompleteTravel Component] Create CompleteTravel Error',
  CreateCompleteTravelSuccess = '[Edit CompleteTravel Component] Create CompleteTravel Success',
  UpdateCompleteTravel = '[Edit CompleteTravel Component] Update CompleteTravel ',
  UpdateCompleteTravelSuccess = '[Edit CompleteTravel Component] Update CompleteTravel Success ',
  DeleteOneCompleteTravel = '[CompleteTravels List Page] One CompleteTravel Deleted',
  DeleteManyCompleteTravels = '[CompleteTravels List Page] Many Selected CompleteTravels Deleted',
  RequestCompleteTravelsPage = '[CompleteTravels List Page] CompleteTravels Page Requested',
  LoadCompleteTravelPage = '[CompleteTravels API] CompleteTravels Page Loaded',
  CancellCompleteTravelPage = '[CompleteTravels API] CompleteTravels Page Cancelled',
  CompleteTravelPageToggleLoading = '[CompleteTravels] CompleteTravels Page Toggle Loading',
  CompleteTravelActionToggleLoading = '[CompleteTravels] CompleteTravels Action Toggle Loading',
  UpdateTravelStatus = '[ListTravel Component] Update Travel Status',
}

export class CreateCompleteTravel implements Action {
  readonly type = CompleteTravelActionTypes.CreateCompleteTravel;
  constructor(
    public payload: {
      completeTravel: TravelModel;
    }
  ) { }
}
export class CreateCompleteTravelError implements Action {
  readonly type = CompleteTravelActionTypes.CreateCompleteTravelError;
  constructor(
    public payload: {
      isError: any;
    }
  ) { }
}

export class CreateCompleteTravelSuccess implements Action {
  readonly type = CompleteTravelActionTypes.CreateCompleteTravelSuccess;
  constructor(
    public payload: {
      completeTravel: TravelModel;
    }
  ) { }
}

export class UpdateCompleteTravel implements Action {
  readonly type = CompleteTravelActionTypes.UpdateCompleteTravel;
  constructor(
    public payload: {
      partialCompleteTravel: Update<TravelModel>; // For State update
      completeTravel: TravelModel; // For Server update (through service)
    }
  ) { }
}

export class UpdateCompleteTravelSuccess implements Action {
  readonly type = CompleteTravelActionTypes.UpdateCompleteTravelSuccess;
  constructor(
    public payload: {
      partialCompleteTravel: Update<TravelModel>; // For State update
      completeTravel: TravelModel; // For Server update (through service)
    }
  ) { }
}

export class DeleteOneCompleteTravel implements Action {
  readonly type = CompleteTravelActionTypes.DeleteOneCompleteTravel;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyCompleteTravels implements Action {
  readonly type = CompleteTravelActionTypes.DeleteManyCompleteTravels;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestCompleteTravelPage implements Action {
  readonly type = CompleteTravelActionTypes.RequestCompleteTravelsPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadCompleteTravelPage implements Action {
  readonly type = CompleteTravelActionTypes.LoadCompleteTravelPage;
  constructor(
    public payload: {
      completeTravel: TravelModel[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) { }
}

export class CancellCompleteTravelPage implements Action {
  readonly type = CompleteTravelActionTypes.CancellCompleteTravelPage;
}

export class CompleteTravelPageToggleLoading implements Action {
  readonly type = CompleteTravelActionTypes.CompleteTravelPageToggleLoading;
  constructor(
    public payload: {
      isLoading: boolean;
    }
  ) { }
}

export class CompleteTravelActionToggleLoading implements Action {
  readonly type = CompleteTravelActionTypes.CompleteTravelActionToggleLoading;
  constructor(
    public payload: {
      isLoading: boolean;
    }
  ) { }
}

export class UpdateTravelStatus implements Action {
  readonly type = CompleteTravelActionTypes.UpdateTravelStatus;
  constructor(public payload: { travelId: string, status: TravelStatusModel }) { }
}

export type CompleteTravelActions =
  | CreateCompleteTravel
  | UpdateCompleteTravel
  | DeleteOneCompleteTravel
  | DeleteManyCompleteTravels
  | RequestCompleteTravelPage
  | LoadCompleteTravelPage
  | CancellCompleteTravelPage
  | CompleteTravelPageToggleLoading
  | CompleteTravelActionToggleLoading
  | CreateCompleteTravelError
  | CreateCompleteTravelSuccess
  | UpdateCompleteTravelSuccess
  | UpdateTravelStatus;
