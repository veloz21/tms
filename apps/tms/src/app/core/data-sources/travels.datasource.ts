import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectTravelsInitWaitingMessage, selectTravelsInStore, selectTravelsPageLoading } from '@tms/selectors/travel.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ template: '' })
export class TravelsDataSource extends BaseDataSource implements OnDestroy {
  private ngUnsuscribe = new Subject();
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectTravelsPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectTravelsInitWaitingMessage)
    );

    this.store
      .pipe(select(selectTravelsInStore), takeUntil(this.ngUnsuscribe))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }
}
