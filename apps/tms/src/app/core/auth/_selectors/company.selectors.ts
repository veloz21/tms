// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { each } from 'lodash';
// CRUD
import { HttpExtenstionsModel, QueryResultsModel } from '../../_base/crud';
import { CompanyModel } from '../_models/company.model';
// State
import { CompanysState } from '../_reducers/company.reducers';


export const selectCompanysState = createFeatureSelector<CompanysState>('companys');

export const selectCompanyById = (companyId: number) => createSelector(
    selectCompanysState,
    companysState => companysState.entities[companyId]
);

export const selectCompanysPageLoading = createSelector(
    selectCompanysState,
    companysState => {
        return companysState.listLoading;
    }
);

export const selectCompanysActionLoading = createSelector(
    selectCompanysState,
    companysState => companysState.actionsloading
);

export const selectLastCreatedCompanyId = createSelector(
    selectCompanysState,
    companysState => companysState.lastCreatedCompanyId
);

export const selectCompanysPageLastQuery = createSelector(
    selectCompanysState,
    companysState => companysState.lastQuery
);

export const selectCompanysInStore = createSelector(
    selectCompanysState,
    companysState => {
        const items: CompanyModel[] = [];
        each(companysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: CompanyModel[] = httpExtension.sortArray(items, companysState.lastQuery.sortField, companysState.lastQuery.sortOrder);
        return new QueryResultsModel(result, companysState.totalCount, '');
    }
);

export const selectCompanysShowInitWaitingMessage = createSelector(
    selectCompanysState,
    companysState => companysState.showInitWaitingMessage
);

export const selectHasCompanysInStore = createSelector(
    selectCompanysState,
    queryResult => {
        if (!queryResult.totalCount) {
            return false;
        }

        return true;
    }
);
