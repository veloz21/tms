import { OnDestroy } from '@angular/core';
import { BaseDataSource, QueryResultsModel } from '@crud';
import { select, Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectTrucksInitWaitingMessage, selectTrucksInStore, selectTrucksPageLoading } from '@selectors/trucks.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class TrucksDataSource extends BaseDataSource implements OnDestroy {
  private ngUnsuscribe = new Subject();
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectTrucksPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectTrucksInitWaitingMessage)
    );

    this.store
      .pipe(select(selectTrucksInStore), takeUntil(this.ngUnsuscribe))
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
