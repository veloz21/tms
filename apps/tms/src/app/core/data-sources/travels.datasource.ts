import { OnDestroy } from '@angular/core';
import { BaseDataSource, QueryResultsModel } from '@crud';
import { select, Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectTravelsInitWaitingMessage, selectTravelsInStore, selectTravelsPageLoading } from '@selectors/travel.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
