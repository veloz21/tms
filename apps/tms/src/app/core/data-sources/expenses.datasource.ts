import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectExpensesInitWaitingMessage, selectExpensesInStore, selectExpensesPageLoading } from '@tms/selectors/expense.selectors';

@Component({ template: '' })
export class BoxesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectExpensesPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(select(selectExpensesInitWaitingMessage));

    this.store.pipe(select(selectExpensesInStore)).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
