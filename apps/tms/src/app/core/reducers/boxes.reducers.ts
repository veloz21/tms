import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { BoxActions, BoxActionTypes } from '@tms/actions/box.actions';
import { QueryParamsModel } from '@tms/crud';
import { BoxModel } from '@tms/models';

export interface BoxesState extends EntityState<BoxModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedBoxId: number;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<BoxModel> = createEntityAdapter<BoxModel>();

export const initialBoxesState: BoxesState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedBoxId: undefined,
  showInitWaitingMessage: true,
});

export function boxesReducer(state = initialBoxesState, action: BoxActions): BoxesState {
  switch (action.type) {
    case BoxActionTypes.BoxesPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading, lastCreatedBoxId: undefined,
      };
    case BoxActionTypes.BoxesActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case BoxActionTypes.CreateBoxSuccess:
      return adapter.addOne(action.payload.box, {
        ...state,
        lastCreatedBoxId: action.payload.box.id,
      });
    case BoxActionTypes.BoxesStatusUpdated: {
      const _partialBoxes: Update<BoxModel>[] = [];
      for (let i = 0; i < action.payload.boxes.length; i++) {
        _partialBoxes.push({
          id: action.payload.boxes[i].id,
          changes: { status: action.payload.status }
        });
      }
      return adapter.updateMany(_partialBoxes, state);
    }
    case BoxActionTypes.UpdateBoxSuccess:
      return adapter.updateOne(action.payload.partialBox, state);

    case BoxActionTypes.DeleteOneBox:
      return adapter.removeOne(action.payload.id, state);
    case BoxActionTypes.DeleteManyBoxes:
      return adapter.removeMany(action.payload.ids, state);
    case BoxActionTypes.CancellBoxesPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case BoxActionTypes.LoadBoxesPage:
      return adapter.addMany(action.payload.boxes, {
        ...initialBoxesState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getBoxState = createFeatureSelector<BoxModel>('boxes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
