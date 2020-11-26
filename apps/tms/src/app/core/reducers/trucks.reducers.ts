import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TruckActions, TruckActionTypes } from '@tms/actions/truck.actions';
import { QueryParamsModel } from '@tms/crud';
import { TruckModel } from '@tms/models';

export interface TrucksState extends EntityState<TruckModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedTruckId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<TruckModel> = createEntityAdapter<TruckModel>();

export const initialTrucksState: TrucksState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedTruckId: undefined,
  showInitWaitingMessage: true
});

export function trucksReducer(state = initialTrucksState, action: TruckActions): TrucksState {
  switch (action.type) {
    case TruckActionTypes.TrucksPageToggleLoading: return {
      ...state, listLoading: action.payload.isLoading, lastCreatedTruckId: undefined
    };
    case TruckActionTypes.TrucksActionToggleLoading: return {
      ...state, actionsloading: action.payload.isLoading
    };
    case TruckActionTypes.CreateTruckSuccess: return adapter.addOne(action.payload.truck, {
      ...state, lastCreatedTruckId: action.payload.truck.id
    });
    case TruckActionTypes.UpdateTruckSuccess: return adapter.updateOne(action.payload.partialTruck, state);
    case TruckActionTypes.DeleteOneTruck: return adapter.removeOne(action.payload.id, state);
    case TruckActionTypes.DeleteManyTrucks: return adapter.removeMany(action.payload.ids, state);
    case TruckActionTypes.CancelTrucksPage: return {
      ...state, listLoading: false, lastQuery: new QueryParamsModel({})
    };
    case TruckActionTypes.LoadTrucksPage:
      return adapter.addMany(action.payload.truck, {
        ...initialTrucksState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    default: return state;
  }
}

export const getTruckState = createFeatureSelector<TruckModel>('trucks');


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
