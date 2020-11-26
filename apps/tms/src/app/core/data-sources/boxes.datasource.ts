import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectBoxesInitWaitingMessage, selectBoxesInStore, selectBoxesPageLoading } from '@tms/selectors/boxes.selectors';

@Component({ template: '' })
export class BoxesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectBoxesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectBoxesInitWaitingMessage)
    );

    this.store.pipe(
      select(selectBoxesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
