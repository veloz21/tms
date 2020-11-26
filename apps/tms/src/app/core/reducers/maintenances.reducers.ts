import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { MaintenanceActions, MaintenanceActionTypes } from '@tms/actions/maintenance.actions';
import { QueryParamsModel } from '@tms/crud';
import { Maintenance } from '@tms/interfaces';

export interface MaintenancesState extends EntityState<Maintenance> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedMaintenanceId: number;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Maintenance> = createEntityAdapter<Maintenance>();

export const initialMaintenancesState: MaintenancesState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedMaintenanceId: undefined,
  showInitWaitingMessage: true,
});

export function maintenancesReducer(state = initialMaintenancesState, action: MaintenanceActions): MaintenancesState {
  switch (action.type) {
    case MaintenanceActionTypes.MaintenancesPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedMaintenanceId: undefined,
      };
    case MaintenanceActionTypes.MaintenancesActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case MaintenanceActionTypes.CreateMaintenance:
      return {
        ...state,
      };
    case MaintenanceActionTypes.CreateMaintenanceSuccess:
      return adapter.addOne(action.payload.maintenance, {
        ...state,
        lastCreatedMaintenanceId: action.payload.maintenance.id,
      });
    case MaintenanceActionTypes.UpdateMaintenanceSuccess:
      return adapter.updateOne(action.payload.partialMaintenance, state);
    case MaintenanceActionTypes.DeleteOneMaintenance:
      return adapter.removeOne(action.payload.id, state);
    case MaintenanceActionTypes.DeleteManyMaintenances:
      return adapter.removeMany(action.payload.ids, state);
    case MaintenanceActionTypes.CancelMaintenancesPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case MaintenanceActionTypes.LoadMaintenancesPage:
      return adapter.addMany(action.payload.maintenance, {
        ...initialMaintenancesState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getMaintenanceState = createFeatureSelector<Maintenance>('maintenance');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
