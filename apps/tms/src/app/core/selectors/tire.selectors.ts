import { HttpExtenstionsModel, QueryResultsModel } from '@crud';
import { TireModel } from '@models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TiresState } from '@reducers';
import { each } from 'lodash';

export const selectTiresState = createFeatureSelector< TiresState>('tires');

export const selectTireById = (tireId: number) =>  createSelector(
    selectTiresState,
    tiresState => tiresState.entities[tireId]
);

export const selectTiresPageLoading = createSelector(
    selectTiresState,
    tiresState => tiresState.listLoading
);

export const selectTiresActionLoading = createSelector(
    selectTiresState,
    customersState => customersState.actionsloading
);

export const selectTiresPageLastQuery = createSelector(
    selectTiresState,
    tiresState => tiresState.lastQuery
);

export const selectLastCreatedTireId = createSelector(
    selectTiresState,
    tiresState => tiresState.lastCreatedTireId,
);

export const selectTiresInitWaitingMessage = createSelector(
    selectTiresState,
    tiresState => tiresState.showInitWaitingMessage
);

export const selectTiresInStore = createSelector(
    selectTiresState,
    tiresState => {
        const items: TireModel[] = [];
        each(tiresState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: TireModel[] = httpExtension.sortArray(items, tiresState.lastQuery.sortField, tiresState.lastQuery.sortOrder);
        return new QueryResultsModel(result, tiresState.totalCount, '');
    }
);

export const selectHasTiresInStore = createSelector(
    selectTiresInStore,
    queryResult => {
        if (!queryResult.totalCount) {
            return false;
        }
        return true;
    }
);
