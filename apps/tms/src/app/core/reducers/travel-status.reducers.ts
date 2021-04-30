import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TravelStatusActions, TravelStatusActionTypes } from '@tms/actions/travel-status.actions';
import { TravelStatusModel } from '@tms/models';

export interface TravelsStatusState extends EntityState<TravelStatusModel> {
  travelStatus: TravelStatusModel[];
}

export const adapter: EntityAdapter<TravelStatusModel> = createEntityAdapter<TravelStatusModel>();

export const initialTravelsStatusState: TravelsStatusState = adapter.getInitialState({
  travelStatus: [],
});

export function travelsStatusReducer(state = initialTravelsStatusState, action: TravelStatusActions): TravelsStatusState {
  switch (action.type) {
    case TravelStatusActionTypes.StoreTravelStatus:
      return {
        ...state,
        travelStatus: action.payload.travelStatus,
      };
    default:
      return state;
  }
}

export const getTravelStatusState = createFeatureSelector<TravelStatusModel>('status');

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
