import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import {
  selectCompleteTravelsInitWaitingMessage,
  selectCompleteTravelsInStore,
  selectCompleteTravelsPageLoading,
} from '@tms/selectors/completeTravel.selectors';

@Component({ template: '' })
export class CompleteTravelsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectCompleteTravelsPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectCompleteTravelsInitWaitingMessage)
    );

    this.store
      .pipe(select(selectCompleteTravelsInStore))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
}
