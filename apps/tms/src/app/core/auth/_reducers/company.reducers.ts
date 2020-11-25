// NGRX
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Actions
import { CompanyActions, CompanyActionTypes } from '../_actions/company.actions';
// Models
import { CompanyModel } from '../_models/company.model';

// tslint:disable-next-line:no-empty-interface
export interface CompanysState extends EntityState<CompanyModel> {
    listLoading: boolean;
    actionsloading: boolean;
    totalCount: number;
    lastCreatedCompanyId: string;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CompanyModel> = createEntityAdapter<CompanyModel>();

export const initialCompanysState: CompanysState = adapter.getInitialState({
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastQuery:  new QueryParamsModel({}),
    lastCreatedCompanyId: undefined,
    showInitWaitingMessage: true
});

export function CompanysReducer(state = initialCompanysState, action: CompanyActions): CompanysState {
    switch  (action.type) {
        case CompanyActionTypes.CompanysPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedCompanyId: undefined
        };
        case CompanyActionTypes.CompanysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CompanyActionTypes.CompanyOnServerCreated: return {
            ...state
        };
        case CompanyActionTypes.CompanyCreated: return adapter.addOne(action.payload.company, {
            ...state, lastCreatedCompanyId: action.payload.company.id
        });
        case CompanyActionTypes.CompanyUpdated: return adapter.updateOne(action.payload.partialCompany, state);
        case CompanyActionTypes.CompanyDeleted: return adapter.removeOne(action.payload.id, state);
        case CompanyActionTypes.CompanysPageCancelled: return {
            ...state, listLoading: false, lastQuery: new QueryParamsModel({})
        };
        case CompanyActionTypes.CompanysPageLoaded: {
            return adapter.addMany(action.payload.Companys, {
                ...initialCompanysState,
                totalCount: action.payload.totalCount,
                lastQuery: action.payload.page,
                listLoading: false,
                showInitWaitingMessage: false
            });
        }
        default: return state;
    }
}

export const getCompanyState = createFeatureSelector<CompanysState>('Companys');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
