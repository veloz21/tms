import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TravelActions, TravelActionTypes } from '@tms/actions/travel.actions';
import { QueryParamsModel } from '@tms/crud';
import { TravelModel, TravelStatusModel } from '@tms/models';

export interface TravelsState extends EntityState<TravelModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedTravelId: string;
  showInitWaitingMessage: boolean;
  travelStatus: TravelStatusModel[];
}

export const adapter: EntityAdapter<TravelModel> = createEntityAdapter<TravelModel>();

export const initialTravelsState: TravelsState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedTravelId: undefined,
  showInitWaitingMessage: true,
  travelStatus: [],
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
    case TravelActionTypes.StoreTravel:
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
        ...state,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    case TravelActionTypes.StoreTravelStatus:
      return {
        ...state,
        travelStatus: action.payload.travelStatus,
      }
    default:
      return state;
  }
}

export const getTravelState = createFeatureSelector<TravelModel>('travel');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
