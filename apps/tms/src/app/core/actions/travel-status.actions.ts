import { Action } from '@ngrx/store';
import { TravelStatusModel } from '@tms/models';

export enum TravelStatusActionTypes {
  GetTravelStatus = '[Edit Travel Component] Get Travel Status',
  StoreTravelStatus = '[Edit Travel Component] Store Travel Status',
}
export class GetTravelStatus implements Action {
  readonly type = TravelStatusActionTypes.GetTravelStatus;
}

export class StoreTravelStatus implements Action {
  readonly type = TravelStatusActionTypes.StoreTravelStatus;
  constructor(public payload: { travelStatus: TravelStatusModel[] }) {}
}

export type TravelStatusActions = GetTravelStatus | StoreTravelStatus;
