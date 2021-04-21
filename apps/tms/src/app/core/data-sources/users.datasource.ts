import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectUsersInitWaitingMessage, selectUsersInStore, selectUsersPageLoading } from '@tms/selectors/user.selectors';

@Component({ template: '' })
export class UsersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectUsersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectUsersInitWaitingMessage)
    );

    this.store.pipe(
      select(selectUsersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
