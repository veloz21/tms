import { OnDestroy } from '@angular/core';
import { BaseDataSource, QueryResultsModel } from '@crud';
import { select, Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectMaintenancesInitWaitingMessage, selectMaintenancesInStore, selectMaintenancesPageLoading } from '@selectors/maintenance.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MaintenancesDataSource extends BaseDataSource implements OnDestroy {
  private ngUnsuscribe = new Subject();
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectMaintenancesPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectMaintenancesInitWaitingMessage)
    );

    this.store
      .pipe(select(selectMaintenancesInStore), takeUntil(this.ngUnsuscribe))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }
}
