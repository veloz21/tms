import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { TireModel } from '@tms/models';

export enum TireActionTypes {
  GetTire = '[Edit Tire Component] Get Tire',
  StoreTire = '[Edit Tire Component] Store Tire',
  CreateTire = '[Edit Tire Component] Create Tire ',
  CreateTireError = '[Edit Tire Component] Create Tire Error',
  CreateTireSuccess = '[Edit Tire Component] Create Tire Success',
  UpdateTire = '[Edit Tire Component] Update Tire ',
  UpdateTireSuccess = '[Edit Tire Component] Update Tire Success ',
  DeleteOneTire = '[Tires List Page] One Tire Deleted',
  DeleteManyTires = '[Tires List Page] Many Selected Tires Deleted',
  RequestTiresPage = '[Tires List Page] Tires Page Requested',
  LoadTiresPage = '[Tires API] Tires Page Loaded',
  CancellTiresPage = '[Tires API] Tires Page Cancelled',
  TiresPageToggleLoading = '[Tires] Tires Page Toggle Loading',
  TiresActionToggleLoading = '[Tires] Tires Action Toggle Loading'
}

export class GetTire implements Action {
  readonly type = TireActionTypes.GetTire;
  constructor(public payload: { id: string }) { }
}

export class StoreTire implements Action {
  readonly type = TireActionTypes.StoreTire;
  constructor(public payload: { tire: TireModel }) { }
}

export class CreateTire implements Action {
  readonly type = TireActionTypes.CreateTire;
  constructor(public payload: { tire: TireModel }) { }
}

export class CreateTireError implements Action {
  readonly type = TireActionTypes.CreateTireError;
  constructor(public payload: { isError: any }) { }
}

export class CreateTireSuccess implements Action {
  readonly type = TireActionTypes.CreateTireSuccess;
  constructor(public payload: { tire: TireModel }) { }
}

export class UpdateTire implements Action {
  readonly type = TireActionTypes.UpdateTire;
  constructor(public payload: {
    partialTire: Update<TireModel>, // For State update
    tire: TireModel // For Server update (through service)
  }) { }
}

export class UpdateTireSuccess implements Action {
  readonly type = TireActionTypes.UpdateTireSuccess;
  constructor(public payload: {
    partialTire: Update<TireModel>, // For State update
    tire: TireModel // For Server update (through service)
  }) { }
}

export class DeleteOneTire implements Action {
  readonly type = TireActionTypes.DeleteOneTire;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyTires implements Action {
  readonly type = TireActionTypes.DeleteManyTires;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestTiresPage implements Action {
  readonly type = TireActionTypes.RequestTiresPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadTiresPage implements Action {
  readonly type = TireActionTypes.LoadTiresPage;
  constructor(public payload: {
    tires: TireModel[],
    totalCount: number,
    page: QueryParamsModel
  }) { }
}

export class CancellTiresPage implements Action {
  readonly type = TireActionTypes.CancellTiresPage;
}

export class TiresPageToggleLoading implements Action {
  readonly type = TireActionTypes.TiresPageToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export class TiresActionToggleLoading implements Action {
  readonly type = TireActionTypes.TiresActionToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export type TireActions =
  | CreateTire
  | UpdateTire
  | DeleteOneTire
  | DeleteManyTires
  | RequestTiresPage
  | LoadTiresPage
  | CancellTiresPage
  | TiresPageToggleLoading
  | TiresActionToggleLoading
  | CreateTireError
  | CreateTireSuccess
  | UpdateTireSuccess
  | GetTire
  | StoreTire
  ;
