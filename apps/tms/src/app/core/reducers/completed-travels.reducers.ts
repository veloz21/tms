import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { CompletedTravelActions, CompletedTravelActionTypes } from '@tms/actions/completed-travel.actions';
import { QueryParamsModel } from '@tms/crud';
import { TravelModel } from '@tms/models';

export interface CompletedTravelsState extends EntityState<TravelModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedCompletedTravelId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<TravelModel> = createEntityAdapter<TravelModel>();

export const initialCompletedTravelsState: CompletedTravelsState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedCompletedTravelId: undefined,
  showInitWaitingMessage: true,
});

export function completedTravelReducer(state = initialCompletedTravelsState, action: CompletedTravelActions): CompletedTravelsState {
  switch (action.type) {
    case CompletedTravelActionTypes.CompletedTravelPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedCompletedTravelId: undefined,
      };
    case CompletedTravelActionTypes.CompletedTravelActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case CompletedTravelActionTypes.CreateCompletedTravelSuccess:
      return adapter.addOne(action.payload.completedTravel, {
        ...state,
        lastCreatedCompletedTravelId: action.payload.completedTravel.id,
      });
    case CompletedTravelActionTypes.UpdateCompletedTravelSuccess:
      return adapter.updateOne(action.payload.partialCompletedTravel, state);

    case CompletedTravelActionTypes.DeleteOneCompletedTravel:
      return adapter.removeOne(action.payload.id, state);
    case CompletedTravelActionTypes.DeleteManyCompletedTravels:
      return adapter.removeMany(action.payload.ids, state);
    case CompletedTravelActionTypes.CancelCompletedTravelPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case CompletedTravelActionTypes.LoadCompletedTravelPage:
      return adapter.addMany(action.payload.completedTravels, {
        ...initialCompletedTravelsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getcompletedTravelState = createFeatureSelector<TravelModel>('completedTravel');

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
