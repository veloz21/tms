import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { TravelModel } from '@tms/models';

export enum TravelActionTypes {
  CreateTravel = '[Edit Travel Component] Create Travel',
  UpdateTravel = '[Edit Travel Component] Update Travel',
  DeleteOneTravel = '[Travel List Page] Delete One Travel',
  DeleteManyTravels = '[Travels List Page] Delete Many Travels',
  RequestTravelsPage = '[Travels List Page] Request Travels Page',
  LoadTravelsPage = '[Travels API] Load Travels Page',
  CancelTravelsPage = '[Travels API] Cancel Travels Page',
  TravelsPageToggleLoading = '[Travels] Travels Page Toggle Loading',
  TravelsActionToggleLoading = '[Travels] Travels Action Toggle Loading',
  CreateTravelSuccess = '[Edit Travel Component] Create Truck Success',
  CreateTravelError = '[Edit Travel Component] Create Travel Error',
  UpdateTravelSuccess = '[Edit Travel Component] Update Travel Success'
}

export class CreateTravel implements Action {
  readonly type = TravelActionTypes.CreateTravel;
  constructor(public payload: { travel: TravelModel }) { }
}

export class CreateTravelSuccess implements Action {
  readonly type = TravelActionTypes.CreateTravelSuccess;
  constructor(public payload: { travel: TravelModel }) { }
}

export class CreateTravelError implements Action {
  readonly type = TravelActionTypes.CreateTravelError;
  constructor(public payload: { error: any }) { }
}

export class UpdateTravel implements Action {
  readonly type = TravelActionTypes.UpdateTravel;
  constructor(
    public payload: {
      partialTravel: Update<TravelModel>; // For State update
      travel: TravelModel; // For Server update (through service)
    }
  ) { }
}

export class UpdateTravelSuccess implements Action {
  readonly type = TravelActionTypes.UpdateTravelSuccess;
  constructor(public payload: {
    partialTravel: Update<TravelModel>, // For State update
    travel: TravelModel // For Server update (through service)
  }) { }
}

export class DeleteOneTravel implements Action {
  readonly type = TravelActionTypes.DeleteOneTravel;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyTravels implements Action {
  readonly type = TravelActionTypes.DeleteManyTravels;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestTravelsPage implements Action {
  readonly type = TravelActionTypes.RequestTravelsPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadTravelsPage implements Action {
  readonly type = TravelActionTypes.LoadTravelsPage;
  constructor(
    public payload: {
      travel: TravelModel[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) { }
}

export class CancelTravelsPage implements Action {
  readonly type = TravelActionTypes.CancelTravelsPage;
}

export class TravelsPageToggleLoading implements Action {
  readonly type = TravelActionTypes.TravelsPageToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export class TravelsActionToggleLoading implements Action {
  readonly type = TravelActionTypes.TravelsActionToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export type TravelActions =
  | CreateTravel
  | UpdateTravel
  | DeleteOneTravel
  | DeleteManyTravels
  | RequestTravelsPage
  | LoadTravelsPage
  | CancelTravelsPage
  | TravelsPageToggleLoading
  | TravelsActionToggleLoading
  | CreateTravelSuccess
  | CreateTravelError
  | UpdateTravelSuccess;
