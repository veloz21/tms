import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { TireActions, TireActionTypes } from '@tms/actions/tire.actions';
import { QueryParamsModel } from '@tms/crud';
import { TireModel } from '@tms/models';

export interface TiresState extends EntityState<TireModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedTireId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<TireModel> = createEntityAdapter<TireModel>();

export const initialTiresState: TiresState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedTireId: undefined,
  showInitWaitingMessage: true
});

export function tiresReducer(state = initialTiresState, action: TireActions): TiresState {
  switch (action.type) {
    case TireActionTypes.TiresPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading, lastCreatedTireId: undefined
      };
    case TireActionTypes.TiresActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading
      };
    case TireActionTypes.StoreTire:
    case TireActionTypes.CreateTireSuccess:
      return adapter.addOne(action.payload.tire, {
        ...state,
        lastCreatedTireId: action.payload.tire.id
      });
    case TireActionTypes.UpdateTireSuccess:
      return adapter.updateOne(action.payload.partialTire, state);

    case TireActionTypes.DeleteOneTire:
      return adapter.removeOne(action.payload.id, state);
    case TireActionTypes.DeleteManyTires:
      return adapter.removeMany(action.payload.ids, state);
    case TireActionTypes.CancellTiresPage:
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    case TireActionTypes.LoadTiresPage:
      return adapter.addMany(action.payload.tires, {
        ...initialTiresState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    default:
      return state;
  }
}

export const getTireState = createFeatureSelector<TireModel>('tires');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
