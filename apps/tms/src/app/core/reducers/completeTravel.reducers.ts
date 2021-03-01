import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { CompleteTravelActions, CompleteTravelActionTypes } from '@tms/actions/completeTravel.actions';
import { QueryParamsModel } from '@tms/crud';
import { TravelModel } from '@tms/models';

export interface CompleteTravelsState extends EntityState<TravelModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedCompleteTravelId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<TravelModel> = createEntityAdapter<TravelModel>();

export const initialCompleteTravelsState: CompleteTravelsState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedCompleteTravelId: undefined,
  showInitWaitingMessage: true,
});

export function completeTravelReducer(state = initialCompleteTravelsState, action: CompleteTravelActions): CompleteTravelsState {
  switch (action.type) {
    case CompleteTravelActionTypes.CompleteTravelPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedCompleteTravelId: undefined,
      };
    case CompleteTravelActionTypes.CompleteTravelActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case CompleteTravelActionTypes.CreateCompleteTravelSuccess:
      return adapter.addOne(action.payload.completeTravel, {
        ...state,
        lastCreatedCompleteTravelId: action.payload.completeTravel.id,
      });
    case CompleteTravelActionTypes.UpdateCompleteTravelSuccess:
      return adapter.updateOne(action.payload.partialCompleteTravel, state);

    case CompleteTravelActionTypes.DeleteOneCompleteTravel:
      return adapter.removeOne(action.payload.id, state);
    case CompleteTravelActionTypes.DeleteManyCompleteTravels:
      return adapter.removeMany(action.payload.ids, state);
    case CompleteTravelActionTypes.CancellCompleteTravelPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case CompleteTravelActionTypes.LoadCompleteTravelPage:
      return adapter.addMany(action.payload.completeTravel, {
        ...initialCompleteTravelsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getcompleteTravelState = createFeatureSelector<TravelModel>('completeTravel');

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
