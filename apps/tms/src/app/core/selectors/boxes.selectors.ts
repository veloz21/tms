import { HttpExtenstionsModel, QueryResultsModel } from '@crud';
import { BoxModel } from '@models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoxesState } from '@reducers';
import { each } from 'lodash';

export const selectBoxesState = createFeatureSelector< BoxesState>('boxes');

export const selectBoxById = (boxId: number) => createSelector(
    selectBoxesState,
    boxesState => boxesState.entities[boxId]
);

export const selectBoxesPageLoading = createSelector(
    selectBoxesState,
    boxesState => boxesState.listLoading
);

export const selectBoxesActionLoading = createSelector(
    selectBoxesState,
    customersState => customersState.actionsloading
);

export const selectBoxesPageLastQuery = createSelector(
    selectBoxesState,
    boxesState => boxesState.lastQuery
);

export const selectLastCreatedBoxId = createSelector(
    selectBoxesState,
    boxesState => boxesState.lastCreatedBoxId
);

export const selectBoxesInitWaitingMessage = createSelector(
    selectBoxesState,
    boxesState => boxesState.showInitWaitingMessage
);

export const selectBoxesInStore = createSelector(
    selectBoxesState,
    boxesState => {
        const items: BoxModel[] = [];
        each(boxesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: BoxModel[] = httpExtension.sortArray(items, boxesState.lastQuery.sortField, boxesState.lastQuery.sortOrder);
        return new QueryResultsModel(result, boxesState.totalCount, '');
    }
);

export const selectHasBoxesInStore = createSelector(
    selectBoxesInStore,
    queryResult => {
        if (!queryResult.totalCount) {
            return false;
        }
        return true;
    }
);
