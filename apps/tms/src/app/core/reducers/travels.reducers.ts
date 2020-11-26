import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TravelActions, TravelActionTypes } from '@tms/actions/travel.actions';
import { QueryParamsModel } from '@tms/crud';
import { Travel } from '@tms/interfaces';

export interface TravelsState extends EntityState<Travel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedTravelId: number;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Travel> = createEntityAdapter<
  Travel
>();

export const initialTravelsState: TravelsState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedTravelId: undefined,
  showInitWaitingMessage: true,
});

export function travelsReducer(
  state = initialTravelsState,
  action: TravelActions
): TravelsState {
  switch (action.type) {
    case TravelActionTypes.TravelsPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedTravelId: undefined,
      };
    case TravelActionTypes.TravelsActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case TravelActionTypes.CreateTravelSuccess:
      return adapter.addOne(action.payload.travel, {
        ...state,
        lastCreatedTravelId: action.payload.travel.id,
      });
    case TravelActionTypes.UpdateTravelSuccess:
      return adapter.updateOne(action.payload.partialTravel, state);
    case TravelActionTypes.DeleteOneTravel:
      return adapter.removeOne(action.payload.id, state);
    case TravelActionTypes.DeleteManyTravels:
      return adapter.removeMany(action.payload.ids, state);
    case TravelActionTypes.CancelTravelsPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case TravelActionTypes.LoadTravelsPage:
      return adapter.addMany(action.payload.travel, {
        ...initialTravelsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getTravelState = createFeatureSelector<Travel>('travel');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
