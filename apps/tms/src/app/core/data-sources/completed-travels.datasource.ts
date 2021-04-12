import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import {
  selectCompletedTravelsInitWaitingMessage,
  selectCompletedTravelsInStore,
  selectCompletedTravelsPageLoading
} from '@tms/selectors/completed-travel.selectors';

@Component({ template: '' })
export class CompletedTravelsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectCompletedTravelsPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectCompletedTravelsInitWaitingMessage)
    );

    this.store
      .pipe(select(selectCompletedTravelsInStore))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
}
