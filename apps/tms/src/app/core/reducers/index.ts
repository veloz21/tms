import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@tms/environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

export { boxesReducer, BoxesState } from './boxes.reducers';
export { completedTravelReducer, CompletedTravelsState } from './completed-travels.reducers';
export { employeesReducer, EmployeesState } from './employees.reducers';
export { maintenancesReducer, MaintenancesState } from './maintenances.reducers';
export { tiresReducer, TiresState } from './tires.reducers';
export { travelsReducer, TravelsState } from './travels.reducers';
export { trucksReducer, TrucksState } from './trucks.reducers';

// tslint:disable-next-line:no-empty-interface
export interface AppState { }

export const reducers: ActionReducerMap<AppState> = { router: routerReducer };

export const metaReducers: Array<MetaReducer<AppState>> = !environment.production ? [storeFreeze] : [];
